
/**
 * Capitalizes given string: hello -> Hello
 * @param {string} s string to Capitalize
 * @returns {string} Capitalized version of given string
 */
export function capitalize(s) {
  return s && s[0].toUpperCase() + s.substring(1);
}
