const PasswordValidator = require('password-validator');

/**
 *
 * Function to validate password
 *
 */
const schema = new PasswordValidator();
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Blacklist these values

/**
 * Function to detect empty strings and arrays with no members
 */
const empty = (data) => {
  if (typeof data === 'undefined' || data === null) {
    return true;
  }
  if (typeof data.length !== 'undefined') {
    if (/^[\s]*$/.test(data.toString())) {
      return true;
    }
    return data.length === 0;
  }
};

module.exports = {
  schema,
  empty,
};
