// @flow
import kebabCase from 'lodash/kebabCase'

export function makeAreaSlug(name: string): string {
	return kebabCase((name || '').replace("'", '')).toLowerCase()
}
