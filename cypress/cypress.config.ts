import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  projectId: 'n7g5qp',
  e2e: {
    baseUrl: 'http://localhost:3001/test',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
