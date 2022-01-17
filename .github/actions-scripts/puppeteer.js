const { readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');
const { once } = require('events');

const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const server = require('../../server');

async function test() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const artifactsPath = 'screenshot';
  const snapshotName = `puppeteer-${process.platform}.png`;
  let error;
  let pixelDifference;
  let diff;

  if (!server.listening) await once(server, 'listening');

  try {
    page.on('console', msg => {
      if (msg.type() === 'error') throw new Error(msg.text());
    });
    page.on('pageerror', err => {
      throw err;
    });

    await page.goto(`http://127.0.0.1:${server.address().port}`, {
      waitUntil: 'networkidle2',
    });
    await page.setViewport({ width: 640, height: 1000 });
    await page.waitForTimeout(500); // Wait for resize to complete
    await page.click('label[for="choices-single-custom-templates"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    mkdirSync(artifactsPath, { recursive: true });
    const imageBuffer = await page.screenshot({
      path: path.join(artifactsPath, snapshotName),
      fullPage: true,
    });

    // compare with snapshot
    const screenshot = PNG.sync.read(imageBuffer);
    const snapshot = PNG.sync.read(
      readFileSync(path.resolve(__dirname, `./__snapshots__/${snapshotName}`)),
    );
    const { width, height } = screenshot;
    diff = new PNG({ width, height });
    pixelDifference = pixelmatch(
      screenshot.data,
      snapshot.data,
      diff.data,
      width,
      height,
      {
        threshold: 0.6,
      },
    );
  } catch (err) {
    console.error(err);
    error = err;
  } finally {
    if (diff) {
      writeFileSync(path.join(artifactsPath, 'diff-' + snapshotName), PNG.sync.write(diff));
    }
    await Promise.all([
      browser.close(),
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
