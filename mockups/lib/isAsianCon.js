function isAsianCon(course) {
	return _.all([
		hasDepartment('ASIAN', c),
		_.contains([210, 215, 216, 220], c.num), // these are the asiancon course numbers
	])
}
