/**
 * Pluralizes an area type
 * @private
 * @param {string} type - the type to pluralize
 * @returns {string} - the pluralized type
 */
export default function pluralizeArea(type) {
    type = type.toLowerCase()
    if (type === 'emphasis') {
        return 'emphases'
    }
    else {
        return type + 's'
    }
}
