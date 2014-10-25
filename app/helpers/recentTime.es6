"use strict";

import * as _ from 'lodash'

let yearPlusTerm = (year, term) => {
	parseInt(String(year) + String(term), 10)
}

function findTerms(startYear, endYear) {
	const now          = new Date();
	const start        = startYear || now.getFullYear() - 4;
	const currentYear  = endYear || now.getFullYear();
	const currentMonth = now.getMonth();

	const mostYears    = [for (year of _.range(start, currentYear)) year];
	const allTerms     = [1, 2, 3, 4, 5];
	const limitedTerms = [1, 2, 3];

	const baseUrl = "/data/courses/";
	const filetype = "json";
	const extension = "." + filetype;

	// Create a list of numbers like 20081 by concatenating the year and term
	// from 2008 to the year before this one.
	let termList = [for (year of mostYears) for (term of allTerms) yearPlusTerm(year, term)];

	// St. Olaf publishes initial Fall, Interim, and Spring data in April of each year.
	// Full data is published by August.
	if (start !== currentYear || start === endYear) {
		if (currentMonth <= 3) {
			// do nothing
		}
		else if (currentMonth >= 4 && currentMonth <= 7) {
			termList.concat([for (term of limitedTerms) yearPlusTerm(currentYear, term)]);
		}
		else if (currentMonth >= 8) {
			termList.concat([for (term of allTerms) yearPlusTerm(currentYear, term)]);
		}
	}
	else {
		termList.concat([for (term of allTerms) yearPlusTerm(currentYear, term)]);
	}

	// Sort the list of terms to 20081, 20082, 20091 (instead of 20081, 20091, 20082)
	termList = termList.sort();

	let termObj = {};
	for (let termName of termList) {
		let details = {
			term: termName,
			url: baseUrl + String(termName) + extension,
		}
		termObj[termName] = details;
	}

	return termObj;
}

let discoverRecentYears = () => {
	const now          = new Date()
	const start        = now.getFullYear() - 4
	const currentYear  = now.getFullYear()

	return _.range(start, currentYear+1)
}

export {
	findTerms,
	discoverRecentYears
}
