// test/models/schedule.test.js
jest.dontMock('../../app/models/schedule.js')
jest.dontMock('immutable')
import Schedule from '../../app/models/schedule.js'
import {List} from 'immutable'

describe('Schedule', () => {
	let sched = undefined
	beforeEach(() => {
		sched = new Schedule({
			id: 1,
			active: true,
			year: 1994,
			semester: 3,
			index: 2,
			title: 'My Schedule',
			clbids: [123, 234, 345],
		})
	})

	it('is a Schedule', () => {
		expect(sched instanceof Schedule).toBe(true)
	})

	it('can be turned into a JS object', () => {
		expect(sched.toJS() instanceof Object).toBe(true)
	})

	it('ignores sets on known properties', () => {
		try {
			sched.index = 3
		} catch (err) {}
		expect(sched.index).toBe(2)
	})

	it('uses the ID that you give it', () => {
		expect(sched.id).toBe(1)
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = new Schedule()
		let sched2 = new Schedule()
		expect(sched1.id).not.toEqual(sched2.id)
	})

	it('converts the JS array of clbids to an Immutable.List', () => {
		expect(List.isList(sched.clbids)).toBe(true)
	})

	it('holds a schedule for a student', () => {
		let {id, active, year, semester, index, title, clbids} = sched

		expect(id).toBe(1)
		expect(active).toBe(true)
		expect(year).toBe(1994)
		expect(semester).toBe(3)
		expect(index).toBe(2)
		expect(title).toBe('My Schedule')
		expect(List.isList(clbids)).toBe(true)
		expect(clbids.toArray()).toEqual([123, 234, 345])
	})

	it('can turn into JSON', () => {
		let result = JSON.stringify(sched)
		expect(result).toBeTruthy()
	})

	it('returns _courseData for .courses', () => {
		expect(sched.courses).toEqual(sched._courseData)
	})

	it('can change year and semester by the .move method', () => {
		let notMoved = sched.move()
		let newYear = sched.move({year: 2012})
		let newSemester = sched.move({semester: 1})
		let allNew = sched.move({year: 2012, semester: 1})

		expect(notMoved).toBe(sched)
		expect(newYear.year).toBe(2012)
		expect(newSemester.semester).toBe(1)

		expect(allNew.year).toBe(2012)
		expect(allNew.semester).toBe(1)
	})

	it('can be rearranged by .reorder', () => {
		let newOrder = sched.reorder(5)
		expect(newOrder.index).toBe(5)
	})

	it('can be renamed by .rename', () => {
		let newName = sched.rename('My New Title')
		expect(newName.title).toBe('My New Title')
	})

	it('only translates some properties into the JSON bit', () => {
		let result = JSON.stringify(sched)
		expect(result).toBe('{"id":1,"active":true,"year":1994,"semester":3,"index":2,"title":"My Schedule","clbids":[123,234,345]}')
		expect(JSON.parse(result)._courseData).toBeUndefined()
	})

	it('returns all of those properties, even the falsey ones', () => {
		let sched1 = new Schedule({
			id: 1, active: false,
			title: 'My Schedule',
		})
		let result = JSON.stringify(sched1)
		expect(result).toBe('{"id":1,"active":false,"year":0,"semester":0,"index":1,"title":"My Schedule","clbids":[]}')
		expect(JSON.parse(result)._courseData).toBeUndefined()
	})

	describe('#course-methods', () => {
		it('supports adding a course', () => {
			let addedCourse = sched.addCourse(918)
			expect(addedCourse.clbids.toArray()).toContain(918)
		})

		it('supports removing a course', () => {
			let removedCourse = sched.removeCourse(123)
			expect(removedCourse.clbids.toArray()).not.toContain(123)
		})

		it('supports rearranging courses', () => {
			let rearranged = sched.reorderCourse(123, 2)
			expect(rearranged.clbids.toArray()).not.toEqual([123, 234, 345])
			expect(rearranged.clbids.toArray()).toEqual([234, 345, 123])
		})
	})
})
