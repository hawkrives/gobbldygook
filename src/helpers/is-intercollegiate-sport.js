import hasDeptNumBetween from './has-dept-num-between'

/**
 * Only one SPM course credit may be earned by students as a result of
 * participation in an approved intercollegiate sport. This credit must be
 * entered as Exercise Science 171-194 at the registration preceding the
 * sport/participation term.
 *
 * @param {Course} course - the course to check
 * @returns {Boolean} - if the course is an intercollegiate sport
 */
function isIntercollegiateSport(course) {
	let result = hasDeptNumBetween({dept: 'ESTH', start: 171, end: 194}, course)
	return result
}

export default isIntercollegiateSport
