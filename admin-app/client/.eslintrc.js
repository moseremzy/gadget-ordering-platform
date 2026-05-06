module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: 2020,
    sourceType: "module",
    requireConfigFile: false,
  },

  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential"
  ],

  rules: {
    "vue/multi-word-component-names": "off",
    "no-console": "off",
  },
};