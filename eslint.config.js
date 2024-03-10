import { parser, configs, plugin } from "typescript-eslint";
import js from "@eslint/js";
import globals from "globals";
export default [
  js.configs.recommended,
  configs.eslintRecommended,
  {
    files: ["src/**/*.ts", "src/**/*.js"],
    ignores: [".eslintrc.js", "/src/assets/*", "/build/*", "index.html", ".node_modules/*", "*.config.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parser: parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: false,
        },
        sourceType: "module",
        ecmaVersion: "latest",
      },
    },
    plugins: {
      tseslint: plugin,
    },
    rules: {
      "no-fallthrough": "off",
      "prefer-const": "error",
      "no-mixed-spaces-and-tabs": "off",
      "no-unused-vars": "off",
      semi: "warn",
      "max-len": "off",
      "block-spacing": ["warn", "always"],
      "brace-style": ["warn", "1tbs"],
      curly: ["warn", "multi-line", "consistent"],
      "object-curly-newline": "off",

      "tseslint/no-extra-semi": "off",
      "tseslint/no-explicit-any": "warn",
      "tseslint/ban-ts-comment": "off",
      "tseslint/no-unused-vars": "off",
    },
  },
];
