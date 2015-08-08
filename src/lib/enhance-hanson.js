import {parse} from './parse-hanson-string'
import cloneDeep from 'lodash/lang/cloneDeep'
import filter from 'lodash/collection/filter'
import forEach from 'lodash/collection/forEach'
import humanizeList from 'humanize-list'
import includes from 'lodash/collection/includes'
import isRequirementName from './is-requirement-name'
import isString from 'lodash/lang/isString'
import keys from 'lodash/object/keys'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import zipObject from 'lodash/array/zipObject'

let declaredVariables = {}

export default function enhanceHanson(data, {topLevel=false}={}) {
	// 1. adds 'result' key, if missing
	// 2. parses the 'result' and 'filter' keys
	// 3. warns if it encounters any lowercase keys not in the whitelist

	const baseWhitelist = ['result', 'message', 'declare']
	const topLevelWhitelist = baseWhitelist.concat(['name', 'revision', 'type', 'sourcePath'])
	const lowerLevelWhitelist = baseWhitelist.concat(['filter', 'message', 'description'])
	const whitelist = topLevel ? topLevelWhitelist : lowerLevelWhitelist

	forEach(keys(data), key => {
		if (!isRequirementName(key) && !includes(whitelist, key)) {
			throw new TypeError(`enhanceHanson(): only ${humanizeList(whitelist)} keys are allowed, and '${key}' is not one of them. all requirements must begin with an uppercase letter or a number.`)
		}
	})

	// install the top-level $type key *after* the whitelist runs
	if (topLevel) {
		data.$type = 'requirement'
	}

	const requirements = filter(keys(data), isRequirementName)
	const abbreviations = zipObject(map(requirements,
		req => [req.replace(/.* \(([A-Z\-]+)\)$|.*$/, '$1'), req]))
	const titles = zipObject(map(requirements,
		req => [req.replace(/(.*?) +\([A-Z\-]+\)$|.*$/, '$1'), req]))

	// console.log(abbreviations, titles)

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
				throw new SyntaxError(`enhanceHanson(): ${e.message} (in '${value}')`)
			}
		}

		return value
	})

	forEach(data.declare || [], (value, key) => {
		delete declaredVariables[key]
	})
	declaredVariables = oldVariables

	return mutated
}
