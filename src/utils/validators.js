/**
 * Blood group validator
 * @param {string} value
 * @returns {boolean}
 * Acceptable blood groups: `[A|B|AB|O][+|-]`
 */
function isValidBloodGroup(value) {
  return /^(A|B|AB|O)[+-]$/.test(value);
}

/**
 * Gender validator
 * @param {string} value
 * @returns {boolean}
 * Acceptable genders: `[male|female|other]`
 */
function isValidGender(value) {
  return /^(male|female|other)$/.test(value);
}

module.exports = { isValidBloodGroup, isValidGender };
