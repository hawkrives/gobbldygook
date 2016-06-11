import {kebabCase} from 'lodash-es'

export default function makeAreaSlug(name) {
	return kebabCase((name || '').replace("'", '')).toLowerCase()
}
