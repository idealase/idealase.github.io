/**
 * Navigation Tests
 * Simple tests to verify that the navigation links are set up correctly
 */

// In a real test environment, we would use a browser automation tool
// like Puppeteer, Cypress, or Playwright, but for simplicity we'll
// just check the HTML structure

const fs = require('fs');
const path = require('path');

const run = async () => {
  console.log('\nRunning navigation tests...');

  try {
    // Check if all required HTML files exist
    const requiredPages = ['index.html', 'about.html', 'documents.html', 'login.html', 'private.html', 'food-eternity.html'];

    for (const page of requiredPages) {
      const filePath = path.join(__dirname, '..', page);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing page: ${page}`);
      }
      console.log(`✓ Found ${page}`);
    }

    // Basic check of navigation structure in each page
    for (const page of requiredPages) {
      const filePath = path.join(__dirname, '..', page);
      const content = fs.readFileSync(filePath, 'utf8');

      // Skip navigation checks for index.html as it's a React app
      if (page === 'index.html') {
        console.log(`✓ Skipping navigation check for React app: ${page}`);
        continue;
      }

      // Check for navigation links in each page
      if (!content.includes('<nav>')) {
        throw new Error(`Navigation menu missing in ${page}`);
      }

      // Check that each page links to the main pages
      if (!content.includes('href="index.html"')) {
        throw new Error(`Link to home page missing in ${page}`);
      }

      if (!content.includes('href="about.html"')) {
        throw new Error(`Link to about page missing in ${page}`);
      }

      if (!content.includes('href="documents.html"')) {
        throw new Error(`Link to documents page missing in ${page}`);
      }

      console.log(`✓ Navigation structure valid in ${page}`);
    }

    console.log('✅ All navigation tests passed');
    return true;
  } catch (error) {
    console.error('❌ Navigation tests failed:', error.message);
    throw error;
  }
};

module.exports = { run };