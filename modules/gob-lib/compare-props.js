// @flow

import every from 'lodash/every'

export function compareProps(oldProps: Object, newProps: Object): boolean {
	return !every(
		oldProps,
		(_: mixed, key: string) => oldProps[key] === newProps[key],
	)
}
