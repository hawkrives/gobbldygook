// @flow
import kebabCase from 'lodash/kebabCase'

export function makeAreaSlug(name) {
	return kebabCase((name || '').replace("'", '')).toLowerCase()
}
