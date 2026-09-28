import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const codeEntryPoints = Object.keys(packageJson.exports)
  .filter((subpath) => subpath !== './package.json')
  .map((subpath) => subpath.replace(/^\./, packageJson.name));

const loadBothWays = async (specifier) => {
  require(specifier);
  await import(specifier);
  console.log(`ok  ${specifier}`);
};

for (const specifier of codeEntryPoints) {
  await loadBothWays(specifier);
}
console.log(`Loaded ${String(codeEntryPoints.length)} entry points on Node ${process.version}`);
