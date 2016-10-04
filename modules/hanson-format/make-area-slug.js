import {kebabCase} from 'lodash'

export function makeAreaSlug(name) {
	return kebabCase((name || '').replace("'", '')).toLowerCase()
}
