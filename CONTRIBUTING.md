# Contributions
In lieu of a formal styleguide, take care to maintain the existing coding style ensuring there are no linting errors. Add unit tests for any new or changed functionality. Lint and test your code using the npm scripts below:

### NPM tasks
| Task                 | Usage                                                        |
| -------------------- | ------------------------------------------------------------ |
| `npm run start`      | Fire up local server for development                         |
| `npm run test:unit`  | Run sequence of unit tests once                              |
| `npm run test:e2e`   | Run sequence of integration tests once                       |
| `npm run test:watch` | Fire up test server and re-test on file change               |
| `npm run js:build`   | Compile Choices to an uglified JavaScript file               |
| `npm run css:watch`  | Watch SCSS files for changes. On a change, run build process |
| `npm run css:build`  | Compile, minify and prefix SCSS files to CSS                 |

## Passing enviromental arguments to rollup

Use `--` followed by normal rollup `--environment` arguments. The last one overrides any previous ones with the same name

An example of changing what js:watch will bind to:
```
npm run js:watch -- --environment WATCH_HOST:0.0.0.0
```

## Pull requests
When submitting a pull request that resolves a bug, feel free to use the following template:

```md
## This is the problem:

## Steps to reproduce:

## This is my solution:
```
