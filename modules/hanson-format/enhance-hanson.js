import {cloneDeep} from 'lodash'
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
import {oxford} from 'humanize-plus'
import {parse} from './parse-hanson-string'

const none = (...args) => !some(...args)
const quote = str => `"${str}"`
const quoteAndJoin = list => list.map(quote).join(', ')

let declaredVariables = {}

const baseWhitelist = ['result', 'message', 'declare', 'children share courses']
const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type', 'sourcePath', 'slug', 'source', 'dateAdded', 'available through', '_error'])
const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description', 'student selected'])

const startRules = {
	'result': 'Result',
	'filter': 'Filter',
}

export function enhanceHanson(data, {topLevel=true}={}) {
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

	// TODO: Document this section
	const requirements = filter(keys(data), isRequirementName)
	let regex = /(.*?) +\(([A-Z\-]+)\)$/i
	const abbreviations = fromPairs(map(requirements,
		req => [req.replace(regex, '$2'), req]))
	const titles = fromPairs(map(requirements,
		req => [req.replace(regex, '$1'), req]))

	// TODO: Remove the need for the global variables object.
	const oldVariables = cloneDeep(declaredVariables)
	declaredVariables = {}

	forEach(data.declare || [], (value, key) => {
		declaredVariables[key] = value
	})

	const mutated = mapValues(data, (value, key) => {
		if (isRequirementName(key)) {
			// expand simple strings into {result: string} objects
			if (isString(value)) {
				value = {result: value}
			}

			// then run enhance on the resultant object
			value = enhanceHanson(value, {topLevel: false})

			// also set $type; the PEG can't do it b/c the spec file is YAML
			// w/ PEG result strings.
			value.$type = 'requirement'
		}

		else if (key === 'result' || key === 'filter') {
			// TODO: Document this loop
			forEach(declaredVariables, (contents, name) => {
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

	const oneOfTheseKeysMustExist = ['result', 'message', 'filter']
	if (none(keys(data), key => includes(oneOfTheseKeysMustExist, key))) {
		let requiredKeys = quoteAndJoin(oneOfTheseKeysMustExist)
		let existingKeys = quoteAndJoin(keys(data))
		throw new TypeError(`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`)
	}

	forEach(data.declare || [], (value, key) => {
		delete declaredVariables[key]
	})
	declaredVariables = oldVariables

	return mutated
}
