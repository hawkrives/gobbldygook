import kebabCase from 'lodash/kebabCase'

export default function makeAreaSlug(name) {
	return kebabCase((name || '').replace(`'`, '')).toLowerCase()
}
