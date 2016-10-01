import plur from 'plur'

/**
 * Pluralizes an area type
 * @private
 * @param {string} type - the type to pluralize
 * @returns {string} - the pluralized type
 */
export default function pluralizeArea(type) {
	return plur(type.toLowerCase(), 2)
}
