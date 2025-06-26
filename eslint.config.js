const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      // 기본적인 TypeScript 규칙만 적용
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // 타입 관련 규칙들을 대폭 완화
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-readonly": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",

      // 네이밍 컨벤션 완화 (핵심만 유지)
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
      ],

      // 일반적인 코드 품질 규칙
      "prefer-const": "warn",
      "no-var": "error",
      "no-console": "off", // console 사용 허용
      eqeqeq: ["warn", "always"],
      "no-throw-literal": "warn",

      // 공공 API SDK 특성상 완화된 규칙들
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // 테스트 파일은 모든 규칙 완화
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
  {
    files: ["examples/**/*.ts"],
    rules: {
      // 예제 파일은 모든 규칙 완화
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "lib/**",
      "dist/**",
      "coverage/**",
      "*.js",
      "jest.config.js",
    ],
  },
];
