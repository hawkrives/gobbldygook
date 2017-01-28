// @flow
const isRequirementNameRegex = /^[A-Z0-9][A-Za-z0-9_\- /]*/

/**
 * Checks if a string is a requirement name.
 * @private
 * @param {string} name - the string to check
 * @returns {boolean} - if it's a string or not
 */
export default function isRequirementName(name: string) {
	// Requirement names must be at least one character long. They must begin
	// with either an uppercase letter or number. They may then contain any
	// combination of upper- and lower-case letters, numbers, underscores,
	// hyphens, and forward-slashes.
  return isRequirementNameRegex.test(name)
}
