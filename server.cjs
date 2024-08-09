/* eslint-disable no-console,global-require,import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DIST_DIR = path.resolve(__dirname, 'public');

const app = express();

app.get('/data', (req, res) => {
  // prevent endpoint from being cached
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');

  const fakeData = [...new Array(50)].map((_, index) => ({
    label: `Label ${index + 1}`,
    value: `Value ${index + 1}`,
  }));

  setTimeout(() => {
    res.status(200).send(fakeData);
  }, 1000);
});

app.use(express.static(DIST_DIR));

const server = app.listen(PORT, err => {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at http://localhost:${server.address().port} 👂`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down server');
  if (server) {
    server.close(err => {
      if (err) {
        console.log('Failed to shut down server');
        process.exit(1);
      }

      console.log('Shut down server');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = server;
