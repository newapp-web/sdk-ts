import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import bundleSize from 'rollup-plugin-bundle-size';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
const globalsConfig = {
  lodash: 'lodash',
  glob: 'glob',
};
const publicConfig = {
  format: 'umd',
  name: '{{namespace}}',
  globals: globalsConfig,
};

const esConfig = {
  format: 'esm',
  globals: globalsConfig,
};

const pluginsConfig = [
  babel({
    babelHelpers: 'bundled',
  }),
  commonjs({
    include: /node_modules/,
  }),
  nodeResolve({
    customResolveOptions: {
      moduleDirectories: ['node_modules'],
    },
  }),
  bundleSize(),
];

const config = defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        ...publicConfig,
      },
      {
        file: 'lib/index.min.js',
        ...publicConfig,
        plugins: [
          terser({
            compress: {
              drop_console: true,
            },
          }),
        ],
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        target: 'ES5',
      }),
      ...pluginsConfig,
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.es.js',
        ...esConfig,
      },
      {
        file: 'lib/index.es.min.js',
        ...esConfig,
        plugins: [
          terser({
            compress: {
              drop_console: true,
            },
          }),
        ],
      },
    ],
    plugins: [
      typescript({
        declaration: true,
      }),
      ...pluginsConfig,
    ],
  },
]);
export default config;
