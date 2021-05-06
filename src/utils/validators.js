/**
 * 
 * @param {string} value
 */
function isValidBloodGroup(value) {
  return /^(A|B|AB|O)[+-]$/.test(value);
}

module.exports = { isValidBloodGroup };
