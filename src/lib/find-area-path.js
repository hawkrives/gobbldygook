import kebabCase from 'lodash/string/kebabCase'
import pluralizeArea from '../../src/lib/pluralize-area'

export default function findAreaPath({name, type, revision}) {
	name = kebabCase(name.replace(`'`, ''))
	type = pluralizeArea(type)
	return `${type}/${name}.yaml`
}
