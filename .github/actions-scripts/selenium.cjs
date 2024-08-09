const path = require('path');
const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const { once } = require('events');

const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs');
const {
  Builder,
  By,
  Key,
  until,
  Capabilities,
  logging,
} = require('selenium-webdriver');

const server = require('../../server.cjs');

async function test() {
  let pixelDifference;
  let error;

  let capabilities;
  switch (process.env.BROWSER) {
    case 'ie':
      capabilities = Capabilities.ie();
      capabilities.set('ignoreProtectedModeSettings', true);
      capabilities.set('ignoreZoomSetting', true);
      capabilities.set('ie.options', {
        enableFullPageScreenshot: true,
        ensureCleanSession: true,
      });
      break;

    case 'edge':
      capabilities = Capabilities.edge();
      break;

    case 'safari':
      capabilities = Capabilities.safari();
      capabilities.set('safari.options', { technologyPreview: false });
      break;

    case 'firefox': {
      capabilities = Capabilities.firefox().setLoggingPrefs({ browser: 'ALL' });
      break;
    }
    case 'chrome': {
      capabilities = Capabilities.chrome().setLoggingPrefs({ browser: 'ALL' });
      capabilities.set('chromeOptions', {
        args: ['--headless', '--no-sandbox', '--disable-gpu'],
      });
      break;
    }
  }

  let driver = await new Builder().withCapabilities(capabilities).build();

  if (!server.listening) await once(server, 'listening');

  try {
    await driver.get(`http://127.0.0.1:${server.address().port}`);

    // wait for last choice to init
    await driver.wait(
      until.elementLocated(By.css('#reset-multiple ~ .choices__list')),
      10000,
      'waiting for all Choices instances to init',
    );

    // Resize window
    await driver
      .manage()
      .window()
      .maximize();
    await driver
      .manage()
      .window()
      // magic numbers here to make sure all demo page are fit inside
      .setRect({ x: 0, y: 0, width: 630, height: 4000 });

    // and click on press space on it, so it should open choices
    await driver
      .findElement(By.css('#reset-multiple ~ .choices__list button'))
      .sendKeys(Key.SPACE);
    await driver.sleep(1000);

    // take screenshot
    const image = await driver.takeScreenshot();
    const imageBuffer = Buffer.from(image, 'base64');

    const snapshotName = `${process.env.BROWSER}-${process.platform}.png`;
    const artifactsPath = 'screenshot';
    mkdirSync(artifactsPath, { recursive: true });

    writeFileSync(path.join(artifactsPath, snapshotName), imageBuffer);

    // compare with snapshot
    const screenshot = PNG.sync.read(imageBuffer);
    const snapshot = PNG.sync.read(
      readFileSync(path.resolve(__dirname, `./__snapshots__/${snapshotName}`)),
    );
    const { width, height } = screenshot;
    const diff = new PNG({ width, height });
    pixelDifference = pixelmatch(
      screenshot.data,
      snapshot.data,
      diff.data,
      width,
      height,
      {
        threshold: 1,
      },
    );
    writeFileSync(path.join(artifactsPath, 'diff.png'), PNG.sync.write(diff));

    // getting console logs
    // ensure no errors in console (only supported in Chrome currently)
    if (process.env.BROWSER === 'chrome') {
      const entries = await driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER);
      if (
        Array.isArray(entries) &&
        entries.some(entry => entry.level.name_ === 'SEVERE')
      )
        throw new Error(JSON.stringify(entries));
    }
  } catch (err) {
    console.error(err);
    error = err;
  } finally {
    await Promise.all([
      driver.quit(),
      new Promise(resolve => server.close(resolve)),
    ]);
  }
  if (pixelDifference > 200) {
    console.error(
      `Snapshot is different from screenshot by ${pixelDifference} pixels`,
    );
    process.exit(1);
  }
  if (error) process.exit(1);
}

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});
process.once('uncaughtException', err => {
  console.error(err);
  process.exit(1);
});
setImmediate(test);
