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

// Generate declaration files in a separate pass
const mainConfigs = [
  createConfig('src/index.ts', 'liquidjs'),
  createConfig('src/dom/index.ts', 'liquidjs-dom'),
  createConfig('src/server/index.ts', 'liquidjs-server'),
  createConfig('src/jsx-runtime.ts', 'liquidjs-jsx-runtime'),
  createConfig('src/jsx-dev-runtime.ts', 'liquidjs-jsx-dev-runtime'),
  createConfig('src/client/index.ts', 'liquidjs-client'),
  createConfig('src/telemetry/index.ts', 'liquidjs-telemetry'),
];

// Declaration bundling config — uses the first build's emitted declarations
const declarationConfig = {
  input: 'src/index.ts',
  output: [{ file: 'dist/liquidjs.d.ts', format: 'esm' }],
  plugins: [dts()],
};

export default [...mainConfigs, declarationConfig];
