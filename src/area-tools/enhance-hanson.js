import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import includes from 'lodash/includes'
import isRequirementName from './is-requirement-name'
import isString from 'lodash/isString'
import keys from 'lodash/keys'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import some from 'lodash/some'
import fromPairs from 'lodash/fromPairs'
import makeAreaSlug from './make-area-slug'
import {oxford} from 'humanize-plus'
import {parse} from './parse-hanson-string'

const none = (...args) => !some(...args)
const quote = str => `"${str}"`

let declaredVariables = {}

const baseWhitelist = ['result', 'message', 'declare']
const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type', 'sourcePath', 'slug', 'source', 'dateAdded', 'available through', '_error'])
const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description'])

export default function enhanceHanson(data, {topLevel=true}={}) {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. throws if it encounters any lowercase keys not in the whitelist
	// 4. throws if it cannot find any of the required keys

	if (typeof data !== 'object') {
		throw new Error(`enhanceHanson: data was not an object!`)
	}

	const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

	forEach(keys(data), key => {
		if (!isRequirementName(key) && !includes(whitelist, key)) {
			throw new TypeError(`enhanceHanson: only ${oxford(whitelist)} keys are allowed, and '${key}' is not one of them. All requirement names must begin with an uppercase letter or a number.`)
		}
	})

	// install the top-level $type key *after* the whitelist runs
	if (topLevel) {
		data.$type = 'requirement'

		// because this only runs at the top level, we know
		// that we'll have a name to use
		data.slug = data.slug || makeAreaSlug(data.name)

		if (typeof data.revision !== 'string') {
			throw new TypeError('enhanceHanson: "revision" must be a string. Try wrapping it in single quotes.')
		}
	}

	const requirements = filter(keys(data), isRequirementName)
	const abbreviations = fromPairs(map(requirements,
		req => [req.replace(/.* \(([A-Z\-]+)\)$|.*$/, '$1'), req]))
	const titles = fromPairs(map(requirements,
		req => [req.replace(/(.*?) +\([A-Z\-]+\)$|.*$/, '$1'), req]))

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
			forEach(declaredVariables, (contents, name) => {
				if (includes(value, '$' + name)) {
					value = value.split(`$${name}`).join(contents)
				}
			})

			try {
				value = parse(value, {abbreviations, titles})
			}
			catch (e) {
				throw new SyntaxError(`enhanceHanson: ${e.message} (in '${value}')`)
			}
		}

		return value
	})

	const oneOfTheseKeysMustExist = ['result', 'message', 'filter']
	if (none(keys(data), key => includes(oneOfTheseKeysMustExist, key))) {
		let requiredKeys = oneOfTheseKeysMustExist.map(quote).join(', ')
		let existingKeys = keys(data).map(quote).join(', ')
		throw new TypeError(`enhanceHanson(): could not find any of [${requiredKeys}] in [${existingKeys}].`)
	}

	forEach(data.declare || [], (value, key) => {
		delete declaredVariables[key]
	})
	declaredVariables = oldVariables

	return mutated
}
