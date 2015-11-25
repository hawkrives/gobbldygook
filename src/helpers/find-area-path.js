import makeAreaSlug from '../area-tools/make-area-slug'
import pluralizeArea from '../../src/helpers/pluralize-area'

export default function findAreaPath({name, type, revision}) {
	return `${pluralizeArea(type)}/${makeAreaSlug(name)}` + (revision === 'latest' ? '' : `-${revision}`)
}
