// @flow

/**
 * Creates an "override path" – a period-separated string.
 * @private
 * @param {string[]} path - the path to create the string from
 * @returns {string} - the stringified path
 */
export default function pathToOverride(path: string[]) {
	return path.join('.').toLowerCase()
}
