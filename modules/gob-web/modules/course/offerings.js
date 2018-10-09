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

export function consolidateOfferings(
	offerings: Array<Offering>,
): Array<?string> {
	return List(offerings)
		.groupBy(({start, end}) => `${start} ${end}`)
		.map(groupedOffers => {
			if (groupedOffers.size < 1) {
				return null
			}

			let days = groupedOffers.map(({day}) => DAYS.get(day)).join('')
			let {start, end} = groupedOffers.first()

			return `${days} ${to12HourTime(start)}-${to12HourTime(end)}`
		})
		.toList()
		.toArray()
}

export function consolidateExpandedOfferings(
	offerings: Array<Offering>,
): Array<?string> {
	return List(offerings)
		.groupBy(({start, end}) => `${start} ${end}`)
		.map(groupedOffers => {
			if (groupedOffers.size < 1) {
				return null
			}

			let days = groupedOffers.map(({day}) => DAYS.get(day)).join('/')
			let {start, end, location} = groupedOffers.first()
			let nbsp = '\u00a0'
			location = location.replace(/ /g, nbsp)

			return `${days} from ${to12HourTime(start)} to ${to12HourTime(
				end,
			)}, in${nbsp}${location}`
		})
		.toList()
		.toArray()
}
