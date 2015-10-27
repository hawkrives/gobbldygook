import deptNumRegex from './dept-num-regex'

/**
 * Checks if a string looks like a deptnum.
 *
 * @param {String} deptNumString - the deptnum
 * @returns {Boolean} - does it quack like a deptnum?
 */
export default function quacksLikeDeptNum(deptNumString) {
	return deptNumRegex.test(deptNumString)
}
