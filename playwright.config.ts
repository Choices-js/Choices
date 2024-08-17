import { defineConfig, devices } from '@playwright/test';
import { PlaywrightTestConfig } from 'playwright/types/test';
import { BundleTest } from './test-e2e/bundle-test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './test-e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'dot',//process.env.CI ? 'dot' : 'list',
  timeout: 2000,
  expect : {
    timeout: 500,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3001/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    testIdAttribute: 'data-test-hook',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  //webServer: {
  //  command: 'npm run start',
  //  url: 'http://127.0.0.1:3001',
  //  reuseExistingServer: !process.env.CI,
  //},
};

const bundles = [
  {
    name: '',
    bundle: '/assets/scripts/choices.js',
    enabled: !process.env.CI
  },
  {
    name: ' - prod',
    bundle: '/assets/scripts/choices.min.js',
    enabled: !!process.env.CI
  },
];
const projects = config.projects;
if (config.use.baseURL) {
  config.projects = [];

  projects.forEach((project) => {
    bundles.forEach(({ name, bundle, enabled }) => {
      if (!enabled) {
        return;
      }
      const projectBundle = {
        ...project,
        name: project.name + name,
        use: {
          ...project.use,
          bundle: config.use.baseURL + bundle,
        }
      };
      config.projects.push(projectBundle);
    });
  });
}

export default defineConfig<BundleTest>(config);