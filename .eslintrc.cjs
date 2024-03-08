module.exports = {
	root: true,
	ignorePatterns: [
		"/src/assets/*",
		"/dist/*",
		"index.html",
		".node_modules/*"
	],
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaFeatures: {
			jsx: false
		},
		sourceType: "module",
		ecmaVersion: "latest"
	},
	plugins: [
		"@typescript-eslint"
	],
	rules: {
		"no-fallthrough": "off",
		"prefer-const": "error",
		"no-mixed-spaces-and-tabs": "off",
		"no-unused-vars": "off",
		semi: "warn",
		"max-len": "off",
		"block-spacing": [
			"warn", "always"
		],
		"brace-style": [
			"warn", "1tbs"
		],
		curly: [
			"warn",
			"multi-line",
			"consistent"
		],
		"object-curly-newline": "off",
		
		"@typescript-eslint/no-extra-semi": "off",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-unused-vars": "off"
	},
	globals: {
		defineProps: "readonly",
		defineEmits: "readonly",
		defineExpose: "readonly",
		withDefaults: "readonly"
	}
}