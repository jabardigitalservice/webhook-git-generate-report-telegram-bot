module.exports = {
  env: {
    commonjs: true,
    es2021: true
  },
  extends: ['standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    use: true
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
  }
}