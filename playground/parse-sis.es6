import '6to5-core/polyfill'
import _ from 'lodash'
import SISData from './sis-degreeaudit.json'
import 'whatwg-fetch'
import Promise from 'bluebird'
import db from '../app/helpers/db'
import loadData from '../app/helpers/loadData'
import comb from '../app/helpers/combos'
import queryCourses from 'sto-helpers/lib/queryCourses'
import {checkScheduleTimeConflicts} from 'sto-sis-time-parser'

loadData()

function tableToJson(table) {
	// from http://johndyer.name/html-table-to-json/
	var data = []; // first row needs to be headers
	var headers = [];
	for (var i=0; i < table.rows[0].cells.length; i++) {
		headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
	}
	// go through cells
	for (var i=1; i<table.rows.length; i++) {
		var tableRow = table.rows[i];
		var rowData = {};
		for (var j=0; j < tableRow.cells.length; j++) {
			rowData[ headers[j] ] = tableRow.cells[j].innerHTML;
		}
		data.push(rowData);
	}
	return data;
}

function prettyCourses(jsonCourses) {
	return jsonCourses.map(function(course) {
let unescapeAllValues = (obj) => _[_.isArray(obj) ? 'map' : 'mapValues'](obj, (value) => {
	if (_.isString(value))
		return _.unescape(value)
	else if (_.isArray(value))
		return unescapeAllValues(value)
	return value
})

		delete course['&nbsp;']
		delete course.inst

		course.credit = course.credit.replace(/\((.*)\)/, '$1')
		course.credit = parseFloat(course.credit)

		if (course['g.e.'])
			course['g.e.'] = course['g.e.'].trim()

		course.num = parseInt(course.no, 10)
		delete course.no

		course.sem = parseInt(course.term, 10)
		delete course.term

		course.year = parseInt(course.year, 10)
		course.term = parseInt(String(course.year) + String(course.sem), 10)

		course.deptnum = course.dept + ' ' + course.num
		course.level = course.level * 100
		course.depts = course.dept.split('/')

		if (course['g.e.'] && course['g.e.'].length)
			course.geneds = course['g.e.'].split(' ')
		delete course['g.e.']

		course.name = course.title.trim()
		delete course.title

		course.some_type = course.type
		delete course.type

		return course
	})
}

function parseHTMLfromJSON() {
	var parser = new DOMParser();
	var html = parser.parseFromString(SISData.sis, 'text/html');
	return parseSIS(html)
}

function parseHTMLfromPage() {
	var html = document.querySelector('#sis')
	return parseSIS(html)
}

function cleanUpPage(html) {
	// Remove the topnav
	var topNav = html.querySelector('.topnav');
	topNav.parentNode.removeChild(topNav);

	var sidebar = html.querySelector('table td:nth-child(1)')
	sidebar.parentNode.removeChild(sidebar);

	// Delve deep within the table structure
	var main = html.querySelector('table td')

	// Get all tables.
	var tonsOfTables = main.querySelectorAll('table');
	// Remove the breadcrumb bar
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0]);
	// Refresh the lsit of tables
	tonsOfTables = main.querySelectorAll('table');
	// Remove the "Degree Audit(s)" header
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0]);
	// Refresh the list of tables
	tonsOfTables = main.querySelectorAll('table');
	// Remove the "B.{A,M}." header
	let degreeType = tonsOfTables[0].textContent.trim().split(' ')[0]
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0]);

	// Now to remove the parent tables
	var tables = Array.prototype.slice.call(main.querySelectorAll('table'));

	// Remove the first parent table
	tables.splice(0, 1)
	// Remove the General Graduation Requirements parent table
	tables.splice(2, 1)
	// Remove the info table and count of s/u courses
	tables.splice(3, 2)

	return [tables, degreeType]
}

function nameTheTables(tables) {
	return {
		info: tables[0],
		areas: tables[1],
		grad: tables[2],
		gened: tables[3],
		courses: tables[4],
	}
}

function processInfoTable(infoTable) {
	var info = {}
	_.each(infoTable.rows, (row) => {
		var rowName = row.cells[0].textContent.replace(/:$/, '').toLowerCase();
		info[rowName] = row.cells[1].textContent;
	})

	info.graduation = parseInt(info['class year'], 10)
	delete info['class year']
	info.matriculation = parseInt(info['curriculum year'], 10)
	delete info['curriculum year']
	info.standing = info['academic standing']
	delete info['academic standing']

	return info
}

function processCoursesTable(coursesTable) {
	var jsonRepresentation = tableToJson(coursesTable)
	jsonRepresentation.pop() // remove the extra row at the end
	var courses = prettyCourses(jsonRepresentation)
	return courses
}

function processGradTable(gradTable) {
	var jsonRepresentation = tableToJson(gradTable)
	let result = {}
	_.each(jsonRepresentation, (value, key) => {
		if (key === '') {
			key = key.replace('&nbsp;', ' ')
			result[key] = {}
		}
	})
	console.log('grad table', jsonRepresentation)
	// return courses
}

function processAreaTable(areaTable) {
	var jsonRepresentation = tableToJson(areaTable)
	let majors = _.chain(jsonRepresentation).pluck('majors').compact().value()
	let concentrations = _.chain(jsonRepresentation).pluck('concentrations').compact().value()
	let emphases = _.chain(jsonRepresentation).pluck('emphases').compact().value()
	return {majors, concentrations, emphases}
}

function lookupAreaAbbrFromTitle(title) {
	let lookup = {
		"AFRICA AND THE AMERICAS": 'AFAM',
		"ALTERNATE LANGUAGE STUDY OPTION": 'ALSO',
		"AMERICAN CONVERSATION": 'AMCON',
		"AMERICAN STUDIES": 'AMST',
		"AMERICAN RACIAL AND MULTICULTURAL STUDIES": 'ARMS',
		"ART AND ART HISTORY": 'ART',
		"ASIAN STUDIES": 'ASIAN',
		"BIOLOGY": 'BIO',
		"BIOMOLECULAR SCIENCE": 'BMOLS',
		"CHEMISTRY": 'CHEM',
		"CHINESE": 'CHIN',
		"CLASSICS": 'CLASS',
		"COMPUTER SCIENCE": 'CSCI',
		"DANCE": 'DANCE',
		"ECONOMICS": 'ECON',
		"EDUCATION": 'EDUC',
		"ENGLISH": 'ENGL',
		"ENVIRONMENTAL STUDIES": 'ENVST',
		"EXERCISE SCIENCE ACTIVITY": 'ESAC',
		"EXERCISE SCIENCE THEORY": 'ESTH',
		"FAMILY STUDIES": 'FAMST',
		"FILM STUDIES": 'FILM',
		"FRENCH": 'FREN',
		"GREAT CONVERSATION": 'GCON',
		"GERMAN": 'GERM',
		"GREEK": 'GREEK',
		"HISTORY": 'HIST',
		"HISPANIC STUDIES": 'HSPST',
		"UNKNOWN (IDFA)": 'IDFA',
		"INTERDEPARTMENTAL": 'INTD',
		"INTERDISCIPLINARY": 'INTER',
		"INTEGRATIVE STUDIES": 'IS',
		"JAPANESE": 'JAPAN',
		"LATIN": 'LATIN',
		"MATHEMATICS": 'MATH',
		"MEDIA STUDIES": 'MEDIA',
		"MEDIEVAL STUDIES": 'MEDVL',
		"MANAGEMENT STUDIES": 'MGMT',
		"MUSIC": 'MUSIC',
		"MUSIC PERFORMANCE": 'MUSPF',
		"NEUROSCIENCE": 'NEURO',
		"NORWEGIAN": 'NORW',
		"NURSING": 'NURS',
		"PHILOSPHY": 'PHIL',
		"PHYSICS": 'PHYS',
		"POLITICAL SCIENCE": 'PSCI',
		"PSYCHOLOGY": 'PSYCH',
		"RELIGION": 'REL',
		"RUSSIAN STUDIES": 'RUSST',
		"RUSSIAN": 'RUSSN',
		"SCIENCE CONVERSATION": 'SCICN',
		"SOCIOLOGY AND ANTHROPOLOGY": 'SOAN',
		"SPANISH": 'SPAN',
		"STATISTICS": 'STAT',
		"SOCIAL WORK": 'SWRK',
		"THEATER": 'THEAT',
		"WOMEN'S STUDIES": 'WMGST',
		"WOMEN'S & GENDER STUDIES": 'WMGST',
		"WRITING": 'WRIT',
	}
	var result = lookup[title.toUpperCase()]
	if (!result)
		return "UNKWN";
	return result
}

function findAreasOfStudy(areas, degreeType) {
	let areasOfStudy = []

	let degree = {type: 'degree'}
	if (degreeType === 'B.A.') {
		degree.id = 'd-ba'
		degree.abbr = 'B.A.'
		degree.title = 'Bachelor of Arts'
	} else if (degreeType === 'B.M.') {
		degree.id = 'd-bm'
		degree.abbr = 'B.M.'
		degree.title = 'Bachelor of Music'
	}
	areasOfStudy.push(degree)

	_.each(areas.majors, (area) => {
		let abbr = lookupAreaAbbrFromTitle(area)
		areasOfStudy.push({
			id: 'm-' + abbr.toLowerCase(),
			type: 'major', abbr: abbr, title: area,
		})
	})

	_.each(areas.concentrations, (area) => {
		let abbr = lookupAreaAbbrFromTitle(area)
		areasOfStudy.push({
			id: 'c-' + abbr.toLowerCase(),
			type: 'concentration', abbr: abbr, title: area,
		})
	})

	_.each(areas.emphases, (area) => {
		let abbr = lookupAreaAbbrFromTitle(area)
		areasOfStudy.push({
			id: 'e-' + abbr.toLowerCase(),
			type: 'emphasis', abbr: abbr, title: area,
		})
	})

	return areasOfStudy
}

function createSchedules(courses) {
	let terms = _.chain(courses).pluck('term').uniq().value()
	let grouped = _.groupBy(courses, 'term')
	let id = 1;
	let schedules = _.map(terms, (t) => {
		let sched = {
			id: id++,
			year: Math.floor(t / 10),
			sem: t % 10,
			title: 'Schedule 1',
			index: 1,
			active: true,
			clbids: [],
			raw_courses: grouped[t]
		}
		_.each(sched.courses, (course, i) => {
			// attempt 1
			let attemptToFindCourse = queryCourses({name: course.name, term: course.term, deptnum: course.deptnum})
			if (attemptToFindCourse) {
				clbids.push(attemptToFindCourse.clbid)
				delete
			}
		})
		return sched
	})
	console.log(schedules)
}

function makeStudent(tables, degreeType) {
	let student = {}

	student.name = tables.info.name
	student.advisor = tables.info.advisor
	student.matriculation = tables.info.matriculation
	student.graduation = tables.info.graduation

	student.studies = findAreasOfStudy(tables.areas, degreeType)
	student.schedules = createSchedules(tables.courses)

	return student
}

function parseSIS(html) {
	let [rawTables, degreeType] = cleanUpPage(html)
	var tables = nameTheTables(rawTables)
	console.log(tables)

	var cleanedTables = {
		courses: processCoursesTable(tables.courses),
		info: processInfoTable(tables.info),
		areas: processAreaTable(tables.areas),
	}

	console.log('cleaned', cleanedTables)
	let student = makeStudent(cleanedTables, degreeType)
	console.log('student', student)

	return student
}

parseHTMLfromJSON()

document.querySelector('button').addEventListener('click', function(ev) {
	parseHTMLfromPage()
})
