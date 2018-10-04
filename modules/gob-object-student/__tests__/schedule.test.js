// @flow

import stringify from 'stabilize'
import {Schedule} from '../schedule'
import {List} from 'immutable'

describe('Schedule', () => {
	it('does not mutate the passed-in object', () => {
		const clbids = []
		const input = {clbids}
		new Schedule(input)
		expect(input.clbids).toBe(clbids)
	})

	it('uses the ID that you give it', () => {
		let schedule = new Schedule({id: '1'})
		expect(schedule.id).toBe('1')
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = new Schedule()
		let sched2 = new Schedule()
		expect(sched1.id).not.toBe(sched2.id)
	})

	it('holds a schedule for a student', () => {
		let sched = new Schedule({
			id: '1',
			active: true,
			year: 1994,
			semester: 3,
			index: 2,
			title: 'My Schedule',
			clbids: ['123', '234', '345'],
		})
		expect(sched).toMatchInlineSnapshot(`
Immutable.Record {
  "id": "1",
  "active": true,
  "index": 2,
  "title": "My Schedule",
  "clbids": Immutable.List [
    "123",
    "234",
    "345",
  ],
  "year": 1994,
  "semester": 3,
  "metadata": Immutable.Map {},
}
`)
	})

	it('can turn into JSON', () => {
		let result = stringify(new Schedule({id: '1', title: 'Schedule 6'}))
		expect(result).toMatchInlineSnapshot(
			`"{\\"active\\":false,\\"clbids\\":[],\\"id\\":\\"1\\",\\"index\\":1,\\"metadata\\":{},\\"semester\\":0,\\"title\\":\\"Schedule 6\\",\\"year\\":0}"`,
		)
	})

	it('converts numeric clbids to strings', () => {
		let sched = new Schedule({
			clbids: [123, 234, 345],
		})

		expect(sched.clbids).toEqual(
			List(['0000000123', '0000000234', '0000000345']),
		)
	})
})
