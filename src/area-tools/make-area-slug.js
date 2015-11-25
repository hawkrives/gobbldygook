import kebabCase from 'lodash/string/kebabCase'

export function makeAreaSlug(name) {
	return kebabCase(name.replace(`'`, '')).toLowerCase()
}
