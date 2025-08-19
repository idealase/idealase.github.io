/**
 * Simple test runner for the website
 * This script would normally use a proper testing framework like Jest
 * but we're keeping it simple for demonstration purposes
 */

console.log('Running website tests...');

// Import test modules
import { run as runNavigationTests } from './navigation-test.js';
import { run as runFormTests } from './form-validation-test.js';
import { run as runArrowVisualizationTest } from './arrow-visualization-test.js';

// Run tests
(async () => {
  try {
    // Run all test modules
    await runNavigationTests();
    await runFormTests();
    await runArrowVisualizationTest();
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  }
})();