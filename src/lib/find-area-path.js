import kebabCase from 'lodash/string/kebabCase'
import pluralizeArea from '../../src/lib/pluralize-area'

export function slugifyAreaName(name) {
	return kebabCase(name.replace(`'`, ''))
}

export default function findAreaPath({name, type, revision}) {
	return `${pluralizeArea(type)}/${slugifyAreaName(name)}-${revision}.yaml`
}
