# My First Website

A simple website project built with HTML, CSS, and JavaScript.

## Project Structure

- `index.html` - The main HTML file with the homepage content
- `about.html` - About page information
- `documents.html` - Documentation page
- `development.html` - Development updates and information
- `login.html` - User authentication page
- `private.html` - Protected content area
- `css/styles.css` - Stylesheet for the website
- `js/script.js` - Main JavaScript functionality
- `js/chat-updater.js` - Functionality for chat features
- `tests/` - Testing suite for various components
  - `arrow-visualization-test.js` - Tests for the interactive arrow visualization
  - `form-validation-test.js` - Tests for contact form validation
  - `navigation-test.js` - Tests for navigation functionality
  - `run-tests.js` - Test runner script

## Features

- Responsive layout for desktop and mobile devices
- Modern navigation with smooth scrolling and page transitions
- Interactive arrow visualization with mouse/touch tracking
- Functional contact form with EmailJS integration
- Dark mode styling with subtle animations
- Testing suite for component validation

## Contact Form

The website includes a fully functional contact form that:
- Validates user input
- Sends emails using EmailJS service
- Provides visual feedback during form submission
- Displays success or error messages to users

## Getting Started

To view this website locally:

1. Clone this repository
2. Install dependencies: `npm install`
3. Open `index.html` in your browser

### EmailJS Setup

To enable the contact form functionality:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up an email service and template
3. Update the `js/script.js` file with your EmailJS credentials:
   - Public Key
   - Service ID
   - Template ID

## Development

This website is built with:

- HTML5 for structure
- CSS3 for styling and animations 
- Vanilla JavaScript for interactivity
- EmailJS for email functionality
- Custom testing framework

### Dependencies

- EmailJS Browser SDK - For sending emails from the contact form

### Testing

Run the tests using:

```
node tests/run-tests.js
```

## Browser Compatibility

Tested and working in:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## License

This project is open source and available for personal use.