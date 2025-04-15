module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
  },
  "rules": {
      "indent": ["warn", 2],
      "linebreak-style": ["warn", "unix"],
      "quotes": ["warn", "single"],
      "semi": ["warn", "always"],
      "no-unused-vars": ["warn"],
      "no-console": ["off"],
      // Setting common errors to warn level
      "no-undef": "warn",
      "no-redeclare": "warn"
  }
};