# Contributions
In lieu of a formal styleguide, take care to maintain the existing coding style ensuring there are no linting errors. Add unit tests for any new or changed functionality. Lint and test your code using the npm scripts below:

### Minified code
For compatibility, `new` and `get` must be pure (side effect free).

### NPM tasks
| Task                      | Usage                                                        |
|---------------------------|--------------------------------------------------------------|
| `npm run start`           | Fire up local server for development                         |
| `npm run test:unit`       | Run sequence of tests once                                   |
| `npm run test:unit:watch` | Fire up test server and re-test on file change               |
| `npm run test:e2e`        | Run sequence of e2e tests (with local server)                |
| `npm run test`            | Run both unit and e2e tests                                  |
| `npm run playwright:gui`  | Run Playwright e2e tests (GUI)                               |
| `npm run playwright:cli`  | Run Playwright e2e tests (CLI)                               |
| `npm run js:build`        | Compile Choices to an uglified JavaScript file               |
| `npm run css:watch`       | Watch SCSS files for changes. On a change, run build process |
| `npm run css:build`       | Compile, minify and prefix SCSS files to CSS                 |

## Passing environmental arguments to rollup

Use `--` followed by normal rollup `--environment` arguments. The last one overrides any previous ones with the same name

An example of changing what js:watch will bind to:
```
npm run js:watch -- --environment WATCH_HOST:0.0.0.0
```

## Build flags

The following build flags are supported via environment variables:

### CHOICES_SEARCH_FUSE
**Values:**: **"full" / "basic" / "null" **
**Usage:** The level of integration with fuse. `full` is the entire fuse.js build, `basic` is fuse.js with just standard fuzzy searching. `null` is a basic prefix string search with no fuse.js
**Example**:
```
npm run js:watch -- --environment CHOICES_SEARCH_FUSE:basic
```

### CHOICES_SEARCH_KMP
**Values:**: **"1" / "0" **
**Usage:** High performance `indexOf`-like search algorithm.
**Example**:
```
npm run js:watch -- --environment CHOICES_SEARCH_KMP:1
```

### CHOICES_CAN_USE_DOM
**Values:**: **"1" / "0" **
**Usage:** Indicates if DOM methods are supported in the global namespace. Useful if importing into DOM or the e2e tests without a DOM implementation available.
**Example**:
```
npm run js:watch -- --environment CHOICES_CAN_USE_DOM:1
```

## Pull requests
When submitting a pull request that resolves a bug, feel free to use the following template:

```md
## This is the problem:

## Steps to reproduce:

## This is my solution:
```
