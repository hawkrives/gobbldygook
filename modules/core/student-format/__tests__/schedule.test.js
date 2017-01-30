import stringify from 'stabilize'

import { Schedule } from '../schedule'

describe('Schedule', () => {
	it('does not mutate the passed-in object', () => {
		const clbids = []
		const input = { clbids }
		Schedule(input)
		expect(input.clbids).toBe(clbids)
	})

	it('uses the ID that you give it', () => {
		let schedule = Schedule({ id: '1' })
		expect(schedule.id).toBe('1')
	})

	it('throws if the ID is not a string', () => {
		expect(() => Schedule({ id: 1 })).toThrow(TypeError)
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = Schedule()
		let sched2 = Schedule()
		expect(sched1.id).not.toBe(sched2.id)
	})

	it('holds a schedule for a student', () => {
		let sched = Schedule({
			id: '1',
			active: true,
			year: 1994,
			semester: 3,
			index: 2,
			title: 'My Schedule',
			clbids: [ 123, 234, 345 ],
		})
		expect(sched).toMatchSnapshot()
		expect(sched.id).toBe('1')
		expect(sched.active).toBe(true)
		expect(sched.year).toBe(1994)
		expect(sched.semester).toBe(3)
		expect(sched.index).toBe(2)
		expect(sched.title).toBe('My Schedule')
		expect(Array.isArray(sched.clbids)).toBe(true)
		expect(sched.clbids).toEqual([ 123, 234, 345 ])
	})

	it('can turn into JSON', () => {
		let result = stringify(Schedule({ id: '1', title: 'Schedule 6' }))
		expect(result).toMatchSnapshot()
	})
})
