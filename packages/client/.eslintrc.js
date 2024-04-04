import parser from "vue-eslint-parser";
import { plugin } from "typescript-eslint";
import eslintConfig from "../../eslint.config";
import vueConfig from "eslint-plugin-vue";
import importConfig from "eslint-plugin-import";
import globals from "globals";

export default [
  eslintConfig,
  vueConfig,
  importConfig,
  {
    files: ["**/*.vue"],
    ignores: [".eslintrc.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parser: parser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: "tsconfig.client.json",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: { "@typescript-eslint": plugin },
    settings: {
      "import/resolver": {
        typescript: {
          // This is needed to properly resolve paths.
          project: "tsconfig.client.json",
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
    rules: {
      // Everything is compiled for the browser so dev dependencies are fine.
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
        },
      ],
      // max-len set to ignore "import" lines (as they usually get long and messy).
      "max-len": "off", //['error', { code: 100, ignorePattern: '^import\\s.+\\sfrom\\s.+;' }],
      // I mainly have this off as it ruins auto import sorting in VSCode.
      "object-curly-newline": "off",
      // Allows "main.vue" files to be named as such.
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["main"],
        },
      ],
      // Not sure how much this is needed anymore?
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
      "no-fallthrough": "off",
      "prefer-const": "error",
      "no-mixed-spaces-and-tabs": "off",
      "no-unused-vars": "off",
      "no-multiple-empty-lines": "off",
    },
  },
];
