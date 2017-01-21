// @flow
import every from 'lodash/every'

export function compareProps(oldProps, newProps) {
	return !every(oldProps, (_, key) => oldProps[key] === newProps[key])
}
