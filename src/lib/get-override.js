import pathToOverride from './path-to-override'

/**
 * Gets an override from an override object
 * @private
 * @param {string[]} path - the path to an override
 * @param {Object} overrides - the overrides object
 * @returns {*} - the value of the override
 */
export default function getOverride(path, overrides) {
	return overrides[pathToOverride(path)]
}
