import {every} from 'lodash-es'

export default function compareProps(oldProps, newProps) {
	return !every(oldProps, (_, key) => oldProps[key] === newProps[key])
}
