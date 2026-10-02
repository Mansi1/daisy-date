import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

/** Bundle budgets in gzipped bytes for what an app imports; `npm run build` must run first. */
const BUDGETS = [
  {
    name: "import { plusDays } from 'daisy-date'",
    code: "export { plusDays } from './dist/index.js';",
    limit: 13_000,
  },
  {
    name: "import { LocalDate } from 'daisy-date'",
    code: "export { LocalDate } from './dist/index.js';",
    limit: 13_000,
  },
  {
    name: "import { format } from 'daisy-date'",
    code: "export { format } from './dist/index.js';",
    limit: 13_000,
  },
  { name: "import * from 'daisy-date'", code: "export * from './dist/index.js';", limit: 14_000 },
  { name: 'daisy-date/locale/en', code: "export { en } from './dist/locale/en.js';", limit: 1_500 },
  { name: 'daisy-date/locale/de', code: "export { de } from './dist/locale/de.js';", limit: 1_500 },
  { name: 'daisy-date/locale/fr', code: "export { fr } from './dist/locale/fr.js';", limit: 1_500 },
  { name: 'daisy-date/locale/es', code: "export { es } from './dist/locale/es.js';", limit: 1_500 },
];

/** Words that only the opt-in packs contain; the root bundle must not include any of them. */
const OPT_IN_LOCALE_WORDS = ['Montag', 'janvier', 'miércoles'];

const bundle = async (code) => {
  const result = await build({
    stdin: { contents: code, resolveDir: projectRoot, loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    logLevel: 'silent',
  });
  return result.outputFiles[0].text;
};

const results = await Promise.all(
  BUDGETS.map(async (budget) => {
    const text = await bundle(budget.code);
    return { ...budget, text, size: gzipSync(text).length };
  }),
);

for (const { name, size, limit } of results) {
  const status = size <= limit ? 'ok  ' : 'FAIL';
  console.log(
    `${status} ${name.padEnd(42)} ${String(size).padStart(6)} B gzip (budget ${String(limit)} B)`,
  );
}

const rootBundle = results.find((result) => result.name === "import * from 'daisy-date'").text;
const leakedWords = OPT_IN_LOCALE_WORDS.filter((word) => rootBundle.includes(word));
console.log(
  leakedWords.length === 0
    ? 'ok   unused locale packs are tree-shaken out of the root bundle'
    : `FAIL the root bundle contains opt-in locale text: ${leakedWords.join(', ')}`,
);

const overBudget = results.filter(({ size, limit }) => size > limit);
if (overBudget.length > 0 || leakedWords.length > 0) {
  process.exitCode = 1;
}
