/**
 * Clean a timestring segment by uppercasing and trimming it.
 *
 * @param {String} segment
 * @returns {String}
 */
function cleanTimestringSegment(segment) {
	let uppercased = segment.toUpperCase()
	let trimmed = uppercased.trim()
	return trimmed
}

export default cleanTimestringSegment
