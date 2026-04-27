import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

function createConfig(input, outputName, tsconfig = './tsconfig.json') {
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
        tsconfig,
        declaration: false,
        declarationDir: undefined,
      }),
      terser({
        compress: {
          passes: 2,
          ecma: 2020,
        },
        mangle: true,
        format: {
          comments: false,
        },
      }),
    ],
    external: [],
  };
}

// Generate declaration files in a separate pass
const mainConfigs = [
  createConfig('src/index.ts', 'specifyjs'),
  createConfig('src/dom/index.ts', 'specifyjs-dom'),
  createConfig('src/server/index.ts', 'specifyjs-server'),
  createConfig('src/jsx-runtime.ts', 'specifyjs-jsx-runtime'),
  createConfig('src/jsx-dev-runtime.ts', 'specifyjs-jsx-dev-runtime'),
  createConfig('src/client/index.ts', 'specifyjs-client'),
  createConfig('src/telemetry/index.ts', 'specifyjs-telemetry'),
  createConfig('src/components-barrel.ts', 'specifyjs-components', './tsconfig.components.json'),
];

// Build tools entry (Node.js only, external deps)
const buildConfig = {
  input: 'src/build/index.ts',
  output: [
    { file: 'dist/specifyjs-build.cjs.js', format: 'cjs', sourcemap: true },
    { file: 'dist/specifyjs-build.esm.js', format: 'esm', sourcemap: true },
  ],
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.json', declaration: false }),
    terser({ compress: { passes: 2, ecma: 2020 }, mangle: true, format: { comments: false } }),
  ],
  external: ['fs', 'path', 'vite', 'node:fs', 'node:path'],
};
mainConfigs.push(buildConfig);

// Declaration bundling configs — one per sub-package
const declarationConfigs = [
  { input: 'src/index.ts', output: [{ file: 'dist/specifyjs.d.ts', format: 'esm' }] },
  { input: 'src/dom/index.ts', output: [{ file: 'dist/specifyjs-dom.d.ts', format: 'esm' }] },
  { input: 'src/server/index.ts', output: [{ file: 'dist/specifyjs-server.d.ts', format: 'esm' }] },
  { input: 'src/client/index.ts', output: [{ file: 'dist/specifyjs-client.d.ts', format: 'esm' }] },
  { input: 'src/telemetry/index.ts', output: [{ file: 'dist/specifyjs-telemetry.d.ts', format: 'esm' }] },
  { input: 'src/components-barrel.ts', output: [{ file: 'dist/specifyjs-components.d.ts', format: 'esm' }] },
  { input: 'src/build/index.ts', output: [{ file: 'dist/specifyjs-build.d.ts', format: 'esm' }] },
].map(cfg => ({ ...cfg, plugins: [dts()] }));

export default [...mainConfigs, ...declarationConfigs];
