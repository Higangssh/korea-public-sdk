import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

const pkg = require('./package.json');

// 번들에 포함할 dependencies 제외하고, peerDependencies만 external로 처리
const external = [
  ...Object.keys(pkg.peerDependencies || {}),
];

const createTypescriptPlugin = (moduleType) => typescript({
  tsconfig: './tsconfig.json',
  declaration: false,
  declarationMap: false,
  compilerOptions: {
    module: moduleType === 'es' ? 'esnext' : 'commonjs',
    target: 'es2020',
  },
});

export default [
  // ES Modules 빌드 (main export)
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'lib/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      createTypescriptPlugin('es'),
    ],
  },
  
  // CommonJS 빌드 (기본)
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      createTypescriptPlugin('cjs'),
    ],
  },
  
  // UMD 빌드 (브라우저용)
  {
    input: 'src/index.ts',
    external: ['axios'], // axios는 외부 의존성으로 유지
    output: {
      file: 'lib/korea-public-sdk.umd.js',
      format: 'umd',
      name: 'KoreaPublicSDK',
      sourcemap: true,
      globals: {
        'axios': 'axios'
      }
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      createTypescriptPlugin('es'),
    ],
  },
  
  // UMD 빌드 (압축된 버전)
  {
    input: 'src/index.ts',
    external: ['axios'],
    output: {
      file: 'lib/korea-public-sdk.umd.min.js',
      format: 'umd',
      name: 'KoreaPublicSDK',
      sourcemap: true,
      globals: {
        'axios': 'axios'
      }
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      createTypescriptPlugin('es'),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        mangle: {
          keep_fnames: true, // 함수 이름 유지 (디버깅용)
        },
      }),
    ],
  },
  
  // TypeScript 선언 파일 전용 빌드
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'lib/index.d.ts',
      format: 'es',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outDir: 'lib',
      }),
    ],
  },
]; 