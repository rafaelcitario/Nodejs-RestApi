module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', '@rocketseat/eslint-config/node'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
