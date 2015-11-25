import kebabCase from 'lodash/string/kebabCase'

export default function makeAreaSlug(name) {
	return kebabCase(name.replace(`'`, '')).toLowerCase()
}
