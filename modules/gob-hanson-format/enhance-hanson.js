// @flow
import isRequirementName from '@gob/examine-student/source/is-requirement-name'
import fromPairs from 'lodash/fromPairs'
import {makeAreaSlug} from './make-area-slug'
import toPairs from 'lodash/toPairs'
const {parse} = require('./parse-hanson-string')

const requirementNameRegex = /(.*?) +\(([A-Z-]+)\)$/i
const quote = str => `"${str}"`
const quoteAndJoin = list => [...list].map(quote).join(', ')

type PegStartRule = 'Filter' | 'Result'

const topLevelRequired: Set<$Keys<HansonFile>> = new Set([
	'name',
	'requirements',
	'result',
	'revision',
	'type',
])

const topLevelWhitelist: Set<$Keys<HansonFile>> = new Set([
	...topLevelRequired,
	'available through',
	'dateAdded',
	'slug',
	'sourcePath',
])

const lowerLevelRequired: Set<$Keys<HansonRequirement>> = new Set([
	'filter',
	'message',
	'result',
])

const lowerLevelWhitelist: Set<$Keys<HansonRequirement>> = new Set([
	...lowerLevelRequired,
	'children share courses',
	'contract',
	'declare',
	'description',
	'student selected',
])

const lowerLevelAllowed: Set<string> = new Set(lowerLevelWhitelist)

type Mapped<T> = {[key: string]: T}

type HansonFile = {
	name: string,
	type: string,
	revision: string,
	result: string,
	requirements: Mapped<string | HansonRequirement>,
	dateAdded?: string,
	sourcePath?: string,
	slug?: string,
	'available through'?: string,
}

export type ParsedHansonFile = {
	name: string,
	type: string,
	revision: string,
	result: Object,
	slug: string,
	requirements: Mapped<ParsedHansonRequirement>,
	dateAdded?: string,
	sourcePath?: string,
	'available through'?: string,
}

type HansonRequirement = {
	'children share courses'?: boolean,
	'student selected'?: boolean,
	contract?: boolean,
	declare?: Mapped<string>,
	description?: boolean,
	filter?: ?string,
	message?: string,
	result: string,
}

export type ParsedHansonRequirement = {
	$type: 'requirement',
	'children share courses'?: boolean,
	'student selected'?: boolean,
	contract?: boolean,
	declare?: Mapped<string>,
	description?: boolean,
	filter: ?Mapped<ParsedHansonRequirement>,
	message: ?string,
	result: Mapped<ParsedHansonRequirement>,
}

export function enhanceHanson(data: HansonFile): ParsedHansonFile {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	if (typeof data !== 'object') {
		throw new Error('enhanceHanson: data was not an object!')
	}

	// Ensure that the top-level required keys exist.
	for (let requiredKey of topLevelRequired) {
		if (!(requiredKey in data)) {
			let requiredKeys = quoteAndJoin(topLevelRequired)
			let existingKeys = quoteAndJoin(Object.keys(data))
			let msg = `enhanceHanson(): "${requiredKey}" is missing in [${existingKeys}] (need all of [${requiredKeys}]).`
			throw new TypeError(msg)
		}
	}

	Object.keys(data).forEach(key => {
		if (!topLevelWhitelist.has(key)) {
			let whitelistStr = quoteAndJoin(topLevelWhitelist)
			let msg = `enhanceHanson: only [${whitelistStr}] keys are allowed, and '${key}' is not one of them.`
			throw new TypeError(msg)
		}
	})

	// ensure that the keys in `requirements` are all valid requirement names
	Object.keys(data.requirements).forEach(key => {
		if (!isRequirementName(key)) {
			let msg =
				'enhanceHanson: All requirement names must begin with an uppercase letter or a number.'
			throw new TypeError(msg)
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

	// Create the lists of requirement titles and abbreviations for the parser.
	let {abbreviations, titles} = extractRequirementNames(data.requirements)
	let result = parseWithPeg(data.result, {
		abbreviations,
		titles,
		startRule: 'Result',
	})

	let enhanced = toPairs(data.requirements).map(([key, value]) => {
		return [key, enhanceHansonRequirement(value)]
	})

	let requirements: Mapped<ParsedHansonRequirement> = fromPairs(enhanced)
	let {name, type, revision, dateAdded, 'available through': available} = data

	let returnValue: ParsedHansonFile = {
		name,
		type,
		revision,
		requirements,
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

export function enhanceHansonRequirement(
	value: string | HansonRequirement,
): ParsedHansonRequirement {
	// expand simple strings into {result: string} objects
	if (typeof value === 'string') {
		value = {result: value, filter: null, declare: {}}
	}

	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	if (typeof value !== 'object') {
		throw new Error('enhanceHansonReq(): data was not an object!')
	}

	let keys = Object.keys(value)

	// Ensure that a result, message, or filter key exists.
	// If filter's the only one, it's going to filter the list of courses
	// available to the child requirements when this is evaluated.
	if (!keys.some(key => lowerLevelRequired.has(key))) {
		let requiredKeys = quoteAndJoin(lowerLevelRequired)
		let existingKeys = quoteAndJoin(keys)
		let msg = `enhanceHansonReq(): could not find any of [${requiredKeys}] in [${existingKeys}].`
		throw new TypeError(msg)
	}

	const whitelist = lowerLevelWhitelist

	keys.forEach(key => {
		if (!isRequirementName(key) && !whitelist.has(key)) {
			const whitelistStr = quoteAndJoin(whitelist)
			let msg = `enhanceHansonReq: only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`
			throw new TypeError(msg)
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

	let parsedResult = parseWithPeg(result, {
		abbreviations,
		titles,
		variables,
		startRule: 'Result',
	})

	let enhanced = toPairs(requirements).map(
		([key: string, value: HansonRequirement]) => {
			if (lowerLevelAllowed.has(key)) {
				return [key, value]
			}

			return [key, enhanceHansonRequirement(value)]
		},
	)

	let returnedValue: ParsedHansonRequirement = {
		...fromPairs(enhanced),
		$type: 'requirement',
		result: parsedResult,
	}

	if (parsedFilter) {
		returnedValue.filter = parsedFilter
	}

	return returnedValue
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

function assertString(value: mixed) {
	return `\`${String(value)}\` should be \`string\`, not \`${typeof value}\``
}

function extractRequirementNames(data: Object) {
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
