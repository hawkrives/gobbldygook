import {evaluate} from 'modules/core/examine-student'
import nomnom from 'nomnom'
import fs from 'graceful-fs'
import {default as compute} from 'modules/core/examine-student/compute'
import get from 'lodash/get'
import loadArea from './lib/load-area'
import yaml from 'js-yaml'
import {isRequirementName, humanizeOperator} from 'modules/core/examine-student'
import toPairs from 'lodash/toPairs'
import map from 'lodash/map'
import filter from 'lodash/filter'
import repeat from 'lodash/repeat'
import some from 'lodash/some'
import keys from 'lodash/keys'
import sortBy from 'lodash/sortBy'
import plur from 'plur'
import chalk from 'chalk'


function condenseCourse(course) {
	return `${sortBy(course.department).join('/')} ${'number' in course ? course.number : `${String(course.level)[0]}XX`}`
}

function summarize(requirement, name, path, depth=0) {
	let prose = ''
	const subReqs = filter(toPairs(requirement), ([k, _]) => isRequirementName(k))
	if (subReqs.length) {
		prose = '\n' + map(subReqs, ([k, v]) => {
			return summarize(v, k, path.concat(k), depth + 1)
		}).join('\n')
	}

	return `${repeat(' ', depth * 2)}${name}: ${requirement.computed}${prose}`
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
		return color(`${resultString}: ${expr._result}`)
	}
	return resultString
}

const AND = chalk.bold('AND')
const OR = chalk.bold('OR')

function stringifyBoolean(expr) {
	if ('$or' in expr) {
		return `(${map(expr.$or, req => stringifyChunk(req)).join(` ${OR} `)})`
	}
	else if ('$and' in expr) {
		return `(${map(expr.$and, req => stringifyChunk(req)).join(` ${AND} `)})`
	}
}

function stringifyCourse(expr) {
	return condenseCourse(expr.$course)
}

function stringifyChildren(expr) {
	if (expr.$children === '$all') {
		return 'all children'
	}
	return `(${map(expr.$children, child => stringifyReference(child)).join(', ')})`
}

function stringifyModifier(expr) {
	let modifier
	if (expr.$from === 'children') {
		modifier = `${stringifyChildren(expr)}`
	}

	else if (expr.$from === 'filter') {
		modifier = 'filter'
	}

	else if (expr.$from === 'filter-where') {
		modifier = `filter, where {${stringifyWhereClause(expr.$where)}}`
	}

	else if (expr.$from === 'where') {
		modifier = `where {${stringifyWhereClause(expr.$where)}}`
	}

	else if (expr.$from === 'children-where') {
		modifier = `${stringifyChildren(expr)}, where {${stringifyWhereClause(expr.$where)}}`
	}
	return `${expr.$count.$num} ${plur(expr.$what, expr.$count.$num)} ${expr.$besides ? `[besides ${condenseCourse(expr.$besides.$course)}] ` : ''}from ${modifier}`
}

function stringifyOccurrence(expr) {
	return `${expr.$count.$num} ${plur('occurrence', expr.$count.$num)} of ${condenseCourse(expr.$course)}`
}

function stringifyOf(expr) {
	return `${expr.$count.$num} of${humanizeOperator(expr.$count.$operator)} (${map(expr.$of, req => stringifyChunk(req)).join(', ')})`
}

function stringifyReference(expr) {
	return `*${expr.$requirement}`
}

function stringifyQualification({$key, $operator, $value}) {
	if ($value instanceof Array) {
		throw new TypeError("stringifyQualification(): what would a comparison to a list even do? oh, wait; I suppose it could compare against one of several values… well, I'm not doing that right now. If you want it, edit the PEG and stick appropriate stuff in here (probably simplest to just call this function again with each possible value and return true if any are true.)")
	}

	else if ($value instanceof Object) {
		if ($value.$type === 'function') {
			const simplifiedOperator = {$key, $operator, $value: $value['$computed-value']}
			return stringifyQualification(simplifiedOperator)
		}
		else if ($value.$type === 'boolean') {
			if ('$or' in $value) {
				return map($value.$or, val => stringifyQualification({$key, $operator, $value: val})).join(` ${OR} `)
			}
			else if ('$and' in $value) {
				return map($value.$and, val => stringifyQualification({$key, $operator, $value: val})).join(` ${AND} `)
			}
			else {
				throw new TypeError(`stringifyQualification(): neither $or nor $and could be found in ${JSON.stringify($value)}`)
			}
		}
		else {
			throw new TypeError(`stringifyQualification(): "${$value.$type}" is not a valid type for a qualification's value.`)
		}
	}

	else {
		// it's a static value; a number or string
		if ($operator === '$eq') {
			return `${$key} = ${$value}`
		}
		else if ($operator === '$ne') {
			return `${$key} != ${$value}`
		}
		else if ($operator === '$lt') {
			return `${$key} < ${$value}`
		}
		else if ($operator === '$lte') {
			return `${$key} <= ${$value}`
		}
		else if ($operator === '$gt') {
			return `${$key} > ${$value}`
		}
		else if ($operator === '$gte') {
			return `${$key} >= ${$value}`
		}
	}

	throw new TypeError(`stringifyQualification: "${$operator} is not a valid operator"`)
}

function stringifyWhereClause(clause) {
	if (clause.$type === 'qualification') {
		return stringifyQualification(clause)
	}
	else if (clause.$type === 'boolean') {
		if ('$and' in clause) {
			return map(clause.$and, stringifyWhereClause).join(' AND ')
		}

		else if ('$or' in clause) {
			return map(clause.$or, stringifyWhereClause).join(' | ')
		}
	}
}

function stringifyWhere(expr) {
	return `${expr.$count.$num} ${plur('course', expr.$count.$num)} where {${stringifyWhereClause(expr.$where)}}`
}

function stringifyFilter(filter) {
	let resultString = 'Filter: '

	// a filter will be either a where-style query or a list of courses
	if ('$where' in filter) {
		resultString += `only courses where {${stringifyWhereClause(filter.$where)}}`
	}
	else if ('$of' in filter) {
		resultString += `only (${map(filter.$of, req => stringifyChunk(req)).join(', ')})`
	}

	return resultString
}

function indent(indentWith, string) {
	return string.split('\n').map(line => indentWith + line).join('\n')
}

function proseify(requirement, name, path, depth=0) {
	let prose = ''
	const hasChildren = some(keys(requirement), isRequirementName)
	if (hasChildren) {
		const subReqs = filter(toPairs(requirement), ([k, _]) => isRequirementName(k))
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
	}

	// or ask for an override
	else if ('message' in requirement) {
		resultString += requirement.message + '\n'
	}

	return indent(depth ? '  ' : '', `${resultString}${prose}`)
}


const checkAgainstArea = ({courses, overrides}, args) => areaData => {
	let result = {}
	let path = []
	if (args.path) {
		path = [areaData.type, areaData.name].concat(args.path.split('.'))
		result = compute(
			get(areaData, args.path),
			{
				path,
				courses,
				overrides,
			}
		)
	}

	else {
		result = evaluate({courses, overrides}, areaData)
		path = [areaData.type, areaData.name]
	}

	if (args.json) {
		console.log(JSON.stringify(result, null, 2))
	}
	else if (args.yaml) {
		console.log(yaml.safeDump(result))
	}
	else if (args.prose) {
		console.log(proseify(result, areaData.name, path))
	}
	else if (args.summary) {
		console.log(summarize(result, areaData.name, path))
	}

	if (!result.computed) {
		process.exit(1)
	}
}

function run({courses, overrides, areas}, args) {
	Promise.all(areas.map(loadArea)).then(areaDatœ => {
		for (const area of areaDatœ) {
			checkAgainstArea({courses, overrides}, args)(area)
		}
	})
}

export function cli() {
	const args = nomnom()
		.option('json', {
			flag: true,
			help: 'print raw json output',
		})
		.option('yaml', {
			flag: true,
			help: 'print yaml-formatted json output',
		})
		.option('prose', {
			flag: true,
			help: 'print prose output',
		})
		.option('summary', {
			flag: true,
			help: 'print summarized output',
		})
		.option('status', {
			flag: true,
			help: 'no output; only use exit code',
		})
		.option('path', {
			type: 'text',
			help: 'change the root of the evaluation',
		})
		.option('studentFile', {
			required: true,
			metavar: 'FILE',
			help: 'The file to process',
			position: 0,
		})
		.parse()

	run(JSON.parse(fs.readFileSync(args.studentFile, 'utf-8')), args)
}
