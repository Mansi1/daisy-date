import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'locale/en': 'src/locale/en.ts',
    'locale/de': 'src/locale/de.ts',
    'locale/fr': 'src/locale/fr.ts',
    'locale/es': 'src/locale/es.ts',
  },
  format: ['esm', 'cjs'],
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
});
