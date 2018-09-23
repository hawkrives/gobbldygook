// @flow
import isRequirementName from '@gob/examine-student/source/is-requirement-name'
import fromPairs from 'lodash/fromPairs'
import {makeAreaSlug} from './make-area-slug'
const {parse} = require('./parse-hanson-string')

const requirementNameRegex = /(.*?) +\(([A-Z-]+)\)$/i
const quote = str => `"${str}"`
const quoteAndJoin = list => [...list].map(quote).join(', ')

const baseWhitelist = ['result', 'message', 'declare', 'children share courses']
const topLevelWhitelist = new Set([
	...baseWhitelist,
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
	...baseWhitelist,
	'filter',
	'message',
	'description',
	'student selected',
	'contract',
])

const startRules = {
	result: 'Result',
	filter: 'Filter',
}

type StringMap = {[key: string]: string}

type HansonData = {
	[key: string]: mixed,
	name?: string,
	revision?: string,
	declare?: StringMap,
	result: mixed,
}

export function enhanceHanson(
	data: HansonData,
	{
		topLevel = true,
		declaredVariables = {},
	}: {topLevel: boolean, declaredVariables: StringMap} = {},
) {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	if (typeof data !== 'object') {
		throw new Error('enhanceHanson: data was not an object!')
	}

	// Ensure that a result, message, or filter key exists.
	// If filter's the only one, it's going to filter the list of courses
	// available to the child requirements when this is evaluated.
	const oneOfTheseKeysMustExist = new Set(['result', 'message', 'filter'])
	if (!Object.keys(data).some(key => oneOfTheseKeysMustExist.has(key))) {
		let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
		let existingKeys = quoteAndJoin(Object.keys(data))
		throw new TypeError(
			`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`,
		)
	}

	const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

	Object.keys(data).forEach(key => {
		if (!isRequirementName(key) && !whitelist.has(key)) {
			const whitelistStr = quoteAndJoin(whitelist)
			throw new TypeError(
				`enhanceHanson: only [${whitelistStr}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`,
			)
		}
	})

	// install the top-level $type key *after* the whitelist runs
	if (topLevel) {
		data.$type = 'requirement'

		// because this only runs at the top level, we know
		// that we'll have a name to use
		data.slug = data.slug || makeAreaSlug(data.name || '')

		if (data.revision && typeof data.revision !== 'string') {
			let rev = data.revision
			throw new TypeError(
				`enhanceHanson: "revision" must be a string. Try wrapping it in single quotes. "${rev}" is a ${typeof rev}.`,
			)
		}
	}

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

	// (Variables)
	// We load the list of variables with the keys listed in the `declare` key
	// into the declaredVariables map. They're defined as a [string: string]
	// mapping.
	declaredVariables = data.declare || {}

	const mutated = Object.entries(data).map(([key: string, value: mixed]) => {
		if (isRequirementName(key)) {
			// expand simple strings into {result: string} objects
			if (typeof value === 'string') {
				value = {result: value}
			}

			// then run enhance on the resultant object
			value = enhanceHanson((value: any), {
				topLevel: false,
				declaredVariables,
			})

			// also set $type; the PEG can't do it b/c the spec file is YAML
			// w/ PEG result strings.
			value.$type = 'requirement'

			return [key, value]
		}

		if (key === 'result' || key === 'filter') {
			if (typeof value !== 'string') {
				throw new Error(
					`value ${String(
						value,
					)} should be a string, not a ${typeof value}`,
				)
			}

			// (Variables)
			// Next up, we go through the list of variables and look for any
			// occurrences of the named variables in the value, prefixed with
			// a $. So, for instance, the variable defined as "math-level-3"
			// would be referenced via "$math-level-3".
			for (let [name, contents] of Object.entries(declaredVariables)) {
				if (typeof contents !== 'string') {
					throw new Error(
						`value ${String(
							contents,
						)} should be a string, not a ${typeof contents}`,
					)
				}

				let exprName = `$${name}`

				// istanbul ignore else
				if (value.includes(exprName)) {
					value = value.split(exprName).join(contents)
				}
			}

			try {
				value = parse(value, {
					abbreviations,
					titles,
					startRule: startRules[key],
				})

				return [key, value]
			} catch (e) {
				throw new SyntaxError(
					`enhanceHanson: ${e.message} (in '${value}')`,
				)
			}
		}

		return [key, value]
	})

	return fromPairs(mutated)
}
