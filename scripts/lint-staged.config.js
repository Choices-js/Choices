module.exports = {
  '*.js': ['eslint --fix --quiet -f visualstudio', 'git add'],
  '*.{ts,scss,yaml,yml,md,html,json,babelrc,eslintrc}': [
    'prettier --write',
    'git add',
  ],
  'src/icons/*.svg': [
    'prettier --write --parser=html --html-whitespace-sensitivity=ignore',
    'git add',
  ],
  '.codecov.yml': () =>
    'curl -f --silent --data-binary @.codecov.yml https://codecov.io/validate',
  'src/scripts/**/*.js': () => 'npm run test:unit',
};
