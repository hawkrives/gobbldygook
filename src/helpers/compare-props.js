import every from 'lodash/collection/every'

export default function compareProps(oldProps, newProps) {
	return !every(oldProps, (_, key) => oldProps[key] === newProps[key])
}
