// @flow

import isRequirementName from '@gob/examine-student/source/is-requirement-name'
import fromPairs from 'lodash/fromPairs'
import toPairs from 'lodash/toPairs'
import {makeAreaSlug} from './make-area-slug'
const {parse} = require('./parse-hanson-string')

type PegStartRule = 'Filter' | 'Result'

const requirementNameRegex = /(.*?) +\(([A-Z-]+)\)$/i
const quote = str => `"${str}"`
const quoteAndJoin = list => [...list].map(quote).join(', ')

const topLevelWhitelist = new Set([
	'result',
	'message',
	'declare',
	'children share courses',
	'name',
	'revision',
	'type',
	'sourcePath',
	'slug',
	'source',
	'dateAdded',
	'available through',
	'_error',
])

const lowerLevelWhitelist = new Set([
	'result',
	'message',
	'declare',
	'children share courses',
	'filter',
	'message',
	'description',
	'student selected',
	'contract',
])

import type {
	Mapped,
	HansonFile,
	ParsedHansonFile,
	HansonRequirement,
	ParsedHansonRequirement,
} from './types'

export function enhanceHanson(data: HansonFile): ParsedHansonFile {
	if (typeof data !== 'object') {
		throw new Error('enhanceHanson: data was not an object!')
	}

	// Ensure that a result, message, or filter key exists.
	// If filter's the only one, it's going to filter the list of courses
	// available to the child requirements when this is evaluated.
	const oneOfTheseKeysMustExist = new Set(['result', 'message'])
	if (!Object.keys(data).some(key => oneOfTheseKeysMustExist.has(key))) {
		let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
		let existingKeys = quoteAndJoin(Object.keys(data))
		throw new TypeError(
			`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`,
		)
	}

	Object.keys(data).forEach(key => {
		if (!isRequirementName(key) && !topLevelWhitelist.has(key)) {
			const whitelistStr = quoteAndJoin(topLevelWhitelist)
			throw new TypeError(
				`enhanceHanson: only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`,
			)
		}
	})

	// because this only runs at the top level, we know
	// that we'll have a name to use
	let slug = data.slug || makeAreaSlug(data.name || '')

	if (data.revision && typeof data.revision !== 'string') {
		let rev = data.revision
		let msg = `enhanceHanson: "revision" must be a string. Try wrapping it in single quotes. "${rev}" is a ${typeof rev}.`
		throw new TypeError(msg)
	}

	let {abbreviations, titles} = extractRequirementNames(data)
	let result = parseWithPeg(data.result, {
		abbreviations,
		titles,
		startRule: 'Result',
	})

	let enhanced = toPairs(data).map(([key, value]) => {
		if (isRequirementName(key)) {
			return [key, enhanceRequirement(value)]
		}
		return [key, value]
	})

	let requirements: Mapped<ParsedHansonRequirement> = fromPairs(enhanced)
	let {name, type, revision, dateAdded, 'available through': available} = data

	let returnValue: ParsedHansonFile = {
		...requirements,
		$type: 'requirement',
		name,
		type,
		revision,
		slug,
		result,
	}

	if (dateAdded) {
		returnValue.dateAdded = dateAdded
	}

	if (available) {
		returnValue['available through'] = available
	}

	return returnValue
}

function enhanceRequirement(
	value: string | HansonRequirement,
): ParsedHansonRequirement {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	// expand simple strings into {result: string} objects
	if (typeof value === 'string') {
		value = {result: value, filter: null, declare: {}}
	}

	if (typeof value !== 'object') {
		throw new Error('enhanceHansonReq(): data was not an object!')
	}

	let keys = Object.keys(value)

	// Ensure that a result, message, or filter key exists.
	// If filter's the only one, it's going to filter the list of courses
	// available to the child requirements when this is evaluated.
	const oneOfTheseKeysMustExist = new Set(['result', 'message', 'filter'])
	if (!keys.some(key => oneOfTheseKeysMustExist.has(key))) {
		let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
		let existingKeys = quoteAndJoin(keys)
		throw new TypeError(
			`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`,
		)
	}

	keys.forEach(key => {
		if (!isRequirementName(key) && !lowerLevelWhitelist.has(key)) {
			const whitelistStr = quoteAndJoin(lowerLevelWhitelist)
			throw new TypeError(
				`enhanceHanson: only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`,
			)
		}
	})

	// Create the lists of requirement titles and abbreviations for the parser.
	let {abbreviations, titles} = extractRequirementNames(value)

	// We load the list of variables with the keys listed in the `declare` key
	// into the declaredVariables map. They're defined as a [string: string]
	// mapping.
	let {declare: variables = {}, result, filter, ...requirements} = value

	let parsedFilter = filter
		? parseWithPeg(filter, {
				abbreviations,
				titles,
				variables,
				startRule: 'Filter',
		  })
		: null

	let parsedResult = result
		? parseWithPeg(result, {
				abbreviations,
				titles,
				variables,
				startRule: 'Result',
		  })
		: null

	let enhanced = toPairs(requirements).map(
		([key: string, value: HansonRequirement]) => {
			if (lowerLevelWhitelist.has(key)) {
				return [key, value]
			}

			return [key, enhanceRequirement(value)]
		},
	)

	let returnedValue: ParsedHansonRequirement = {
		...fromPairs(enhanced),
		$type: 'requirement',
	}

	if (parsedResult) {
		returnedValue.result = parsedResult
	}

	if (parsedFilter) {
		returnedValue.filter = parsedFilter
	}

	return returnedValue
}

function assertString(value: mixed) {
	return `\`${String(value)}\` should be \`string\`, not \`${typeof value}\``
}

function extractRequirementNames(data: {}) {
	// Create the lists of requirement titles and abbreviations for the parser.
	// Because we allow both full titles ("Biblical Studies") and shorthand
	// abbreviations ("BTS-B") all glommed together into one string ("Biblical
	// Studies (BTS-B)"), we need a method of splitting those apart so the
	// PEG's ReferenceExpression can correctly reference them.
	const requirements = Object.keys(data).filter(isRequirementName)
	const abbreviations = fromPairs(
		requirements.map(req => [req.replace(requirementNameRegex, '$2'), req]),
	)
	const titles = fromPairs(
		requirements.map(req => [req.replace(requirementNameRegex, '$1'), req]),
	)
	return {abbreviations, titles}
}

type ParsePegArgs = {
	variables?: Mapped<string>,
	titles: Mapped<string>,
	abbreviations: Mapped<string>,
}

function parseWithPeg(
	value: string,
	args: ParsePegArgs & {startRule: PegStartRule},
): Object {
	let {variables = {}, titles, abbreviations, startRule} = args

	if (typeof value !== 'string') {
		throw new Error(assertString(value))
	}

	value = insertVariables(value, variables)

	try {
		return parse(value, {abbreviations, titles, startRule})
	} catch (e) {
		throw new SyntaxError(`enhanceHanson: ${e.message} (in '${value}')`)
	}
}

function insertVariables(value: string, vars: Mapped<string>): string {
	// Next up, we go through the list of variables and look for any
	// occurrences of the named variables in the value, prefixed with
	// a $. So, for instance, the variable defined as "math-level-3"
	// would be referenced via "$math-level-3".

	for (let [name, contents] of toPairs(vars)) {
		if (typeof contents !== 'string') {
			throw new Error(assertString(value))
		}

		let exprName = `$${name}`
		// istanbul ignore else
		if (value.includes(exprName)) {
			value = value.split(exprName).join(contents)
		}
	}

	return value
}
