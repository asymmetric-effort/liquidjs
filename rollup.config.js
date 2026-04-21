import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

function createConfig(input, outputName) {
  return {
    input,
    output: [
      {
        file: `dist/${outputName}.cjs.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/${outputName}.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
    ],
    external: [],
  };
}

export default [
  createConfig('src/index.ts', 'liquidjs'),
  createConfig('src/dom/index.ts', 'liquidjs-dom'),
  createConfig('src/server/index.ts', 'liquidjs-server'),
  createConfig('src/jsx-runtime.ts', 'liquidjs-jsx-runtime'),
  createConfig('src/jsx-dev-runtime.ts', 'liquidjs-jsx-dev-runtime'),
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/liquidjs.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
