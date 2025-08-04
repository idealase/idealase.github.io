import js from '@eslint/js';
import security from 'eslint-plugin-security';
import noSecrets from 'eslint-plugin-no-secrets';

export default [
  js.configs.recommended,
  {
    plugins: {
      security,
      'no-secrets': noSecrets
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        emailjs: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        Math: 'readonly',
        setTimeout: 'readonly',
        alert: 'readonly'
      }
    },
    rules: {
      'indent': ['error', 2], // Strengthen to error
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'no-unused-vars': ['error'],
      'no-console': ['off'],
      'no-undef': 'error',
      'no-redeclare': 'error',
      // Security rules - these are the important ones
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-non-literal-require': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'security/detect-pseudoRandomBytes': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      // Secret detection rules
      'no-secrets/no-secrets': ['error', {
        ignoreContent: ['emailjs.init', 'service_', 'template_', 'sBWi2Myw71iv3sKXL', 'service_szc0b2r', 'template_zxvpn0b'],
        tolerance: 4.5
      }]
    }
  }
];