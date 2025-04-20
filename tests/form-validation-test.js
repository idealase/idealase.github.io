/**
 * Form Validation Tests
 * Tests to verify that the contact form exists and has validation
 */

const fs = require('fs');
const path = require('path');

const run = async () => {
  console.log('\nRunning form validation tests...');
  
  try {
    // Check if index.html has a contact form
    const indexPath = path.join(__dirname, '..', 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (!indexContent.includes('id="contact-form"')) {
      throw new Error('Contact form not found in index.html');
    }
    console.log('✓ Contact form found in index.html');
    
    // Check form required fields
    if (!indexContent.includes('name="name" required')) {
      throw new Error('Name field with required attribute not found');
    }
    console.log('✓ Name field with required attribute found');
    
    if (!indexContent.includes('name="email" required')) {
      throw new Error('Email field with required attribute not found');
    }
    console.log('✓ Email field with required attribute found');
    
    if (!indexContent.includes('name="message" required')) {
      throw new Error('Message field with required attribute not found');
    }
    console.log('✓ Message field with required attribute found');
    
    // Check if script.js has form handling code
    const scriptPath = path.join(__dirname, '..', 'js', 'script.js');
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    if (!scriptContent.includes('contactForm.addEventListener')) {
      throw new Error('Form submission handler not found in script.js');
    }
    console.log('✓ Form submission handler found in script.js');
    
    console.log('✅ All form validation tests passed');
    return true;
  } catch (error) {
    console.error('❌ Form validation tests failed:', error.message);
    throw error;
  }
};

module.exports = { run };