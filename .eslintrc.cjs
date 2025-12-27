module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
  },
};
