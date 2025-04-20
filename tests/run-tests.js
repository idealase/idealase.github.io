/**
 * Simple test runner for the website
 * This script would normally use a proper testing framework like Jest
 * but we're keeping it simple for demonstration purposes
 */

console.log('Running website tests...');

// Import test modules
const navigationTests = require('./navigation-test');
const formTests = require('./form-validation-test');
const arrowVisualizationTest = require('./arrow-visualization-test');

// Run tests
(async () => {
  try {
    // Run all test modules
    await navigationTests.run();
    await formTests.run();
    await arrowVisualizationTest.run();
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
})();