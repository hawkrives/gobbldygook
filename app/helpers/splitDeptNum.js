import {contains} from 'lodash'

/**
 * Splits a deptnum string (like "AS/RE 230A") into its components,
 * like {depts: ['AS', 'RE'], num: 230, sect: 'A'}.
 *
 * @param {String} deptNumString
 * @returns {Object}
 */
function splitDeptNum(deptNumString) {
	// "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
	// -> {depts: ['AS', 'RE'], num: 230}
	let combined = deptNumString.toUpperCase()
	let regex = /(([A-Z]+)(?=\/)(?:\/)([A-Z]+)|[A-Z]+) *([0-9]+) *([A-Z]?)/gi
	let matches = regex.exec(combined)

	return {
		depts: contains(matches[1], '/') ? [matches[2], matches[3]] : [matches[1]],
		num: parseInt(matches[4], 10),
	}
}

export default splitDeptNum
