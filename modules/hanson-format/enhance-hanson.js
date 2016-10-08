import {filter} from 'lodash'
import {forEach} from 'lodash'
import {includes} from 'lodash'
import isRequirementName from './is-requirement-name'
import {isString} from 'lodash'
import {keys} from 'lodash'
import {map} from 'lodash'
import {mapValues} from 'lodash'
import {some} from 'lodash'
import {fromPairs} from 'lodash'
import {makeAreaSlug} from './make-area-slug'
import {parse} from './parse-hanson-string'

const requirementNameRegex = /(.*?) +\(([A-Z\-]+)\)$/i
const none = (arr, pred) => !some(arr, pred)
const quote = str => `"${str}"`
const quoteAndJoin = list => list.map(quote).join(', ')

const baseWhitelist = ['result', 'message', 'declare', 'children share courses']
const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type', 'sourcePath', 'slug', 'source', 'dateAdded', 'available through', '_error'])
const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description', 'student selected'])

const startRules = {
	'result': 'Result',
	'filter': 'Filter',
}

export function enhanceHanson(data, {topLevel=true, declaredVariables={}}={}) {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	if (typeof data !== 'object') {
		throw new Error('enhanceHanson: data was not an object!')
	}

	const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

	forEach(keys(data), key => {
		if (!isRequirementName(key) && !includes(whitelist, key)) {
			throw new TypeError(`enhanceHanson: only [${quoteAndJoin(whitelist)}] keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`)
		}
	})

	// install the top-level $type key *after* the whitelist runs
	if (topLevel) {
		data.$type = 'requirement'

		// because this only runs at the top level, we know
		// that we'll have a name to use
		data.slug = data.slug || makeAreaSlug(data.name)

		if (data.revision && typeof data.revision !== 'string') {
			throw new TypeError(`enhanceHanson: "revision" must be a string. Try wrapping it in single quotes. "${data.revision}" is a ${typeof data.revision}.`)
		}
	}

	// Create the lists of requirement titles and abbreviations for the parser.
	// Because we allow both full titles ("Biblical Studies") and shorthand
	// abbreviations ("BTS-B") all glommed together into one string ("Biblical
	// Studies (BTS-B)"), we need a method of splitting those apart so the
	// PEG's ReferenceExpression can correctly reference them.
	const requirements = filter(keys(data), isRequirementName)
	const abbreviations = fromPairs(map(requirements, req => [req.replace(requirementNameRegex, '$2'), req]))
	const titles = fromPairs(map(requirements, req => [req.replace(requirementNameRegex, '$1'), req]))

	// (Variables)
	// We load the list of variables with the keys listed in the `declare` key
	// into the declaredVariables map. They're defined as a [string: string]
	// mapping.
	declaredVariables = data.declare || {}

	const mutated = mapValues(data, (value, key) => {
		if (isRequirementName(key)) {
			// expand simple strings into {result: string} objects
			if (isString(value)) {
				value = {result: value}
			}

			// then run enhance on the resultant object
			value = enhanceHanson(value, {topLevel: false, declaredVariables})

			// also set $type; the PEG can't do it b/c the spec file is YAML
			// w/ PEG result strings.
			value.$type = 'requirement'
		}

		else if (key === 'result' || key === 'filter') {
			// (Variables)
			// Next up, we go through the list of variables and look for any
			// occurrences of the named variables in the value, prefixed with
			// a $. So, for instance, the variable defined as "math-level-3"
			// would be referenced via "$math-level-3".
			forEach(declaredVariables, (contents, name) => {
				// istanbul ignore else
				if (includes(value, '$' + name)) {
					value = value.split(`$${name}`).join(contents)
				}
			})

			const startRule = startRules[key]

			try {
				value = parse(value, {abbreviations, titles, startRule})
			}
			catch (e) {
				throw new SyntaxError(`enhanceHanson: ${e.message} (in '${value}')`)
			}
		}

		return value
	})

	// Ensure that a result, message, or filter key exists.
	// If filter's the only one, it's going to filter the list of courses
	// available to the child requirements when this is evaluated.
	const oneOfTheseKeysMustExist = ['result', 'message', 'filter']
	if (none(keys(data), key => includes(oneOfTheseKeysMustExist, key))) {
		let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
		let existingKeys = quoteAndJoin(keys(data))
		throw new TypeError(`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`)
	}

	return mutated
}
