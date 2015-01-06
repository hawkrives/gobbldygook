import * as _ from 'lodash'

let yearPlusTerm = (year, term) => {
	parseInt(String(year) + String(term), 10)
}

function findTerms(startYear, endYear) {
	let now          = new Date()
	let start        = startYear || now.getFullYear() - 4
	let currentYear  = endYear || now.getFullYear()
	let currentMonth = now.getMonth()

	let mostYears    = _.range(start, currentYear)
	let allTerms     = [1, 2, 3, 4, 5]
	let limitedTerms = [1, 2, 3]

	let baseUrl = '/data/courses/'
	let extension = '.json'

	// Create a list of numbers like 20081 by concatenating the year and term
	// from 2008 to the year before this one.
	let termList = _.map(mostYears, (year) => _.map(allTerms, (term) => yearPlusTerm(year, term)))

	// St. Olaf publishes initial Fall, Interim, and Spring data in April of each year.
	// Full data is published by August.
	if (start !== currentYear || start === endYear) {
		// do nothing if the current month is <= 3
		if (currentMonth >= 4 && currentMonth <= 7) {
			termList.concat(_.map(limitedTerms, (term) => yearPlusTerm(currentYear, term)))
		}
		else if (currentMonth >= 8) {
			termList.concat(_.map(allTerms, (term) => yearPlusTerm(currentYear, term)))
		}
	}
	else {
		termList.concat(_.map(allTerms, (term) => yearPlusTerm(currentYear, term)))
	}

	// Sort the list of terms to 20081, 20082, 20091 (instead of 20081, 20091, 20082)
	termList = termList.sort()

	let termObj = {}
	_.each(termList, (termName) => {
		termObj[termName] = {
			term: termName,
			url: baseUrl + String(termName) + extension,
		}
	})

	return termObj
}

let discoverRecentYears = () => {
	let now          = new Date()
	let start        = now.getFullYear() - 4
	let currentYear  = now.getFullYear()

	return _.range(start, currentYear + 1)
}

export {
	findTerms,
	discoverRecentYears
}
