// @flow

import {to12HourTime} from '@gob/lib'
import values from 'lodash/values'
import groupBy from 'lodash/groupBy'
import type {Offering} from '@gob/types'

const DAYS = {
	Mo: 'M',
	Tu: 'T',
	We: 'W',
	Th: 'Th',
	Fr: 'F',
}

export function consolidateOfferings(
	offerings: Array<Offering>,
): Array<?string> {
	let grouped = groupBy(offerings, ({start, end}) => `${start} ${end}`)

	return values(grouped).map(groupedOffers => {
		if (groupedOffers.length < 1) {
			return null
		}

		let days = groupedOffers.map(({day}) => DAYS[day]).join('')
		let {start, end} = groupedOffers[0]

		return `${days} ${to12HourTime(start)}-${to12HourTime(end)}`
	})
}
