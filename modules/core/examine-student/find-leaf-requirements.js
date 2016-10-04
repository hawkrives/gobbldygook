import {flatten} from 'lodash'
import {map} from 'lodash'
import {compact} from 'lodash'
import isRequirementName from './is-requirement-name'
import {isPlainObject} from 'lodash'
import {keys} from 'lodash'
import {some} from 'lodash'

/**
 * Searches recursively through a requirement tree to find all of the
 * leaf requirements – all of the requirements with no children.
 *
 * @param {Requirement} requirement - the root requirement
 * @returns {Course[]} - the leaf children
 */
export default function findLeafRequirements(requirement) {
	// Time to muse. Just what is a "requirement with no children?"
	// I think that it's just that – a requirement with no children;
	// that is, one with no properties that pass the isRequirementName check.
	// If there are any children, then we call this func on each of them.
	// It should eventually return an array of all of the leaf children.

	// if it's not an object, return instantly.
	if (!isPlainObject(requirement)) {
		return null
	}

	// we've gone too far down!
	if (requirement.$type !== 'requirement') {
		return null
	}

	if (requirement.computed === true) {
		return [requirement]
	}

	// if there are no keys in this object which are requirement names,
	// then we've found a leaf requirement! return it.
	if (!some(keys(requirement), isRequirementName)) {
		return requirement
	}

	// otherwise, run findLeafRequirements over the object, to descend further
	// down the tree of madness.
	return compact(flatten(map(requirement, findLeafRequirements)))
}
