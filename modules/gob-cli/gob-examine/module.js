import meow from 'meow'
import stdin from 'get-stdin'
import loadJsonFile from 'load-json-file'
import {
	isRequirementName,
	humanizeOperator,
	evaluate,
} from '@gob/examine-student'
import loadArea from '../lib/load-area'
import yaml from 'js-yaml'
import get from 'lodash/get'
import toPairs from 'lodash/toPairs'
import map from 'lodash/map'
import filter from 'lodash/filter'
import repeat from 'lodash/repeat'
import some from 'lodash/some'
import keys from 'lodash/keys'
import plur from 'plur'
import chalk from 'chalk'
import {getAllCourses} from '../lib/get-all-courses'

function condenseCourse(course) {
	const num =
		'number' in course ? course.number : `${String(course.level)[0]}XX`
	return `${course.department} ${num}`
}

function summarize(requirement, name, path, depth = 0) {
	let prose = ''
	const subReqs = filter(toPairs(requirement), ([k, _]) =>
		isRequirementName(k),
	)
	if (subReqs.length) {
		prose =
			'\n' +
			map(subReqs, ([k, v]) => {
				return summarize(v, k, path.concat(k), depth + 1)
			}).join('\n')
	}

	return `${repeat(' ', depth * 2)}${name}: ${String(
		requirement.computed,
	)}${prose}`
}

function stringifyChunk(expr) {
	let resultString = ''
	switch (expr.$type) {
		case 'boolean':
			resultString = stringifyBoolean(expr)
			break
		case 'course':
			resultString = stringifyCourse(expr)
			break
		case 'modifier':
			resultString = stringifyModifier(expr)
			break
		case 'occurrence':
			resultString = stringifyOccurrence(expr)
			break
		case 'of':
			resultString = stringifyOf(expr)
			break
		case 'reference':
			resultString = stringifyReference(expr)
			break
		case 'where':
			resultString = stringifyWhere(expr)
			break
		default:
			throw new Error(`uh oh! unknown type "${expr.$type}"`)
	}

	if ('_result' in expr) {
		const color = expr._result ? chalk.green : chalk.red
		return color(`${String(resultString)}: ${String(expr._result)}`)
	}

	return resultString
}

const AND = chalk.bold('AND')
const OR = chalk.bold('OR')

function stringifyBoolean(expr) {
	if ('$or' in expr) {
		const str = expr.$or.map(req => stringifyChunk(req)).join(` ${OR} `)
		return `(${str})`
	} else if ('$and' in expr) {
		const str = expr.$and.map(req => stringifyChunk(req)).join(` ${AND} `)
		return `(${str})`
	}
}

function stringifyCourse(expr) {
	return condenseCourse(expr.$course)
}

function stringifyChildren(expr) {
	if (expr.$children === '$all') {
		return 'all children'
	}
	const str = map(expr.$children, stringifyReference).join(', ')
	return `(${str})`
}

function stringifyModifier(expr) {
	let modifier
	if (expr.$from === 'children') {
		modifier = `${stringifyChildren(expr)}`
	} else if (expr.$from === 'filter') {
		modifier = 'filter'
	} else if (expr.$from === 'filter-where') {
		modifier = `filter, where {${stringifyWhereClause(expr.$where)}}`
	} else if (expr.$from === 'where') {
		modifier = `where {${stringifyWhereClause(expr.$where)}}`
	} else if (expr.$from === 'children-where') {
		modifier = `${stringifyChildren(expr)}, where {${stringifyWhereClause(
			expr.$where,
		)}}`
	}

	const word = plur(expr.$what, expr.$count.$num)
	const besides = expr.$besides
		? `[besides ${condenseCourse(expr.$besides.$course)}] `
		: ''
	return `${expr.$count.$num} ${word} ${besides}from ${modifier}`
}

function stringifyOccurrence(expr) {
	const word = expr.$count.$num === 1 ? 'occurrence' : 'occurrences'
	return `${expr.$count.$num} ${word} of ${condenseCourse(expr.$course)}`
}

function stringifyOf(expr) {
	const op = humanizeOperator(expr.$count.$operator)
	const ofs = map(expr.$of, req => stringifyChunk(req)).join(', ')
	return `${expr.$count.$num} of${op} (${ofs})`
}

function stringifyReference(expr) {
	return `*${expr.$requirement}`
}

function stringifyQualification({$key, $operator, $value}) {
	if ($value instanceof Array) {
		const msg =
			"stringifyQualification(): what would a comparison to a list even do? oh, wait; I suppose it could compare against one of several values… well, I'm not doing that right now. If you want it, edit the PEG and stick appropriate stuff in here (probably simplest to just call this function again with each possible value and return true if any are true.)"
		throw new TypeError(msg)
	} else if ($value instanceof Object) {
		if ($value.$type === 'function') {
			const simplifiedOperator = {
				$key,
				$operator,
				$value: $value['$computed-value'],
			}
			return stringifyQualification(simplifiedOperator)
		} else if ($value.$type === 'boolean') {
			let ds = []
			let conjunction = ''
			if ('$or' in $value) {
				ds = $value.$or
				conjunction = ` ${OR} `
			} else if ('$and' in $value) {
				ds = $value.$and
				conjunction = ` ${AND} `
			} else {
				const val = JSON.stringify($value)
				const msg = `stringifyQualification(): neither $or nor $and could be found in ${val}`
				throw new TypeError(msg)
			}
			return map(ds, val =>
				stringifyQualification({$key, $operator, $value: val}),
			).join(conjunction)
		} else {
			const msg = `stringifyQualification(): "${
				$value.$type
			}" is not a valid type for a qualification's value.`
			throw new TypeError(msg)
		}
	} else {
		// it's a static value; a number or string
		if ($operator === '$eq') {
			return `${$key} = ${$value}`
		} else if ($operator === '$ne') {
			return `${$key} != ${$value}`
		} else if ($operator === '$lt') {
			return `${$key} < ${$value}`
		} else if ($operator === '$lte') {
			return `${$key} <= ${$value}`
		} else if ($operator === '$gt') {
			return `${$key} > ${$value}`
		} else if ($operator === '$gte') {
			return `${$key} >= ${$value}`
		}
	}

	throw new TypeError(
		`stringifyQualification: "${$operator} is not a valid operator"`,
	)
}

function stringifyWhereClause(clause) {
	if (clause.$type === 'qualification') {
		return stringifyQualification(clause)
	} else if (clause.$type === 'boolean') {
		if ('$and' in clause) {
			return map(clause.$and, stringifyWhereClause).join(' AND ')
		} else if ('$or' in clause) {
			return map(clause.$or, stringifyWhereClause).join(' | ')
		}
	}
}

function stringifyWhere(expr) {
	const word = plur('course', expr.$count.$num)
	const where = stringifyWhereClause(expr.$where)
	return `${expr.$count.$num} ${word} where {${where}}`
}

function stringifyFilter(filter) {
	let resultString = 'Filter: '

	// a filter will be either a where-style query or a list of courses
	if ('$where' in filter) {
		const where = stringifyWhereClause(filter.$where)
		resultString += `only courses where {${where}}`
	} else if ('$of' in filter) {
		const ofs = map(filter.$of, req => stringifyChunk(req)).join(', ')
		resultString += `only (${ofs})`
	}

	return resultString
}

function indent(indentWith, string) {
	return string
		.split('\n')
		.map(line => indentWith + line)
		.join('\n')
}

function proseify(requirement, name, path, depth = 0) {
	let prose = ''

	const hasChildren = some(keys(requirement), isRequirementName)
	if (hasChildren) {
		const subReqs = filter(toPairs(requirement), ([k, _]) =>
			isRequirementName(k),
		)

		prose = map(subReqs, ([k, v]) => {
			return proseify(v, k, path.concat(k), depth + 1)
		}).join('\n')
	}

	let resultString = `${name}: `

	if ('filter' in requirement) {
		resultString += stringifyFilter(requirement.filter) + '\n'
	}

	// Now check for results
	if ('result' in requirement) {
		resultString += stringifyChunk(requirement.result) + '\n'
	} else if ('message' in requirement) {
		// or ask for an override
		resultString += requirement.message + '\n'
	}

	return indent(depth ? '  ' : '', `${resultString}${prose}`)
}

const checkAgainstArea = ({courses, overrides}, args, areaData) => {
	let result = {}
	let path = []

	if (args.path) {
		path = [areaData.type, areaData.name].concat(args.path.split('.'))
		result = evaluate(get(areaData, args.path), {
			path,
			courses,
			overrides,
		})
	} else {
		result = evaluate({courses, overrides}, areaData)
		path = [areaData.type, areaData.name]
	}

	if (args.json) {
		console.log(JSON.stringify(result, null, 2))
	} else if (args.yaml) {
		console.log(yaml.safeDump(result))
	} else if (args.prose) {
		console.log(proseify(result, areaData.name, path))
	} else if (args.summary) {
		console.log(summarize(result, areaData.name, path))
	}

	if (!result.computed) {
		if (!args.status) {
			console.log(`[${areaData.type}] ${areaData.name}: failure`)
		}
		process.exit(1)
	} else {
		if (!args.status) {
			console.log(`[${areaData.type}] ${areaData.name}: success`)
		}
	}
}

async function run({overrides, studies, schedules, fabrications}, args) {
	let areaData = await Promise.all(studies.map(loadArea))
	let courses = await getAllCourses({schedules, fabrications})

	for (const area of areaData) {
		checkAgainstArea({courses, overrides}, args, area)
	}
}

export default async function main() {
	const args = meow(`
		usage: gob-examine <FILE>

		FILE: the file to process

		--json: print raw json output
		--yaml: print yaml-formatted json output
		--prose: print prose output
		--summary: print summarized output
		--status: no output; only use exit code
		--path: change the root of the evaluation
	`)

	let {input, flags} = args

	let data = input.length
		? await loadJsonFile(input[0])
		: JSON.parse(await stdin())

	run(data, flags)
}
