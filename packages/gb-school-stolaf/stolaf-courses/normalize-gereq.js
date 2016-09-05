// @flow
import {fullToAbbr} from './mapping-gereqs'

export function normalizeGereq(gereq: string): string {
	if (!(gereq in fullToAbbr)) {
		return gereq.toUpperCase()
	}
	return fullToAbbr[gereq]
}
