// @flow

import {to12HourTime} from '@gob/lib'
import {List, Map} from 'immutable'
import type {Offering} from '@gob/types'

const DAYS = Map({
	Mo: 'M',
	Tu: 'T',
	We: 'W',
	Th: 'Th',
	Fr: 'F',
})

const nbsp = '\u00a0'

export function consolidateOfferings(
	offerings: Array<Offering>,
): Array<string> {
	return List(offerings)
		.groupBy(({start, end}) => `${start} ${end}`)
		.map(groupedOffers => {
			let days = groupedOffers.map(({day}) => DAYS.get(day)).join('')
			let {start, end} = groupedOffers.first()

			return `${days} ${to12HourTime(start)}-${to12HourTime(end)}`
		})
		.toList()
		.toArray()
}

export function consolidateExpandedOfferings(
	offerings: Array<Offering>,
): Array<string> {
	return List(offerings)
		.groupBy(({start, end}) => `${start} ${end}`)
		.map(groupedOffers => {
			let days = groupedOffers.map(({day}) => DAYS.get(day)).join('/')
			let {start, end, location} = groupedOffers.first()

			start = to12HourTime(start)
			end = to12HourTime(end)

			if (location) {
				location = location.replace(/ /g, nbsp)
				return `${days} from ${start} to ${end}, in${nbsp}${location}`
			}

			return `${days} from ${start} to ${end}`
		})
		.toList()
		.toArray()
}
