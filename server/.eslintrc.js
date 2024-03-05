module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    'standard',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },

  ignorePatterns: [
    'node_modules/',
    '*.test.js',
    'package.json',
    'package-lock.json'
  ],
  overrides: [
    {
      files: ['**/*.test.js'],
      rules: {
        'jest/valid-expect': 'error'
      }
    }
  ],
  rules: {
    'no-multiple-empty-lines': ['error', { max: 1 }],
    semi: ['error', 'never'],
    'no-trailing-spaces': 'error',
    indent: ['error', 2],
    'new-cap': ['off']
  }
}
