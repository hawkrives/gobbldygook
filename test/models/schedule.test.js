import {expect} from 'chai'
import stringify from 'json-stable-stringify'

const {
	default: Schedule,
	addCourse,
	removeCourse,
	renameSchedule,
	moveSchedule,
	reorderSchedule,
	reorderCourse,
} = require('../../src/models/schedule')

describe('Schedule', () => {
	let sched = undefined
	beforeEach(() => {
		sched = Schedule({
			id: 1,
			active: true,
			year: 1994,
			semester: 3,
			index: 2,
			title: 'My Schedule',
			clbids: [123, 234, 345],
		})
	})

	it('does not mutate the passed-in object', () => {
		const clbids = []
		const input = {clbids}
		Schedule(input)
		expect(input.clbids).to.equal(clbids)
	})

	it('uses the ID that you give it', () => {
		expect(sched.id).to.equal(1)
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = Schedule()
		let sched2 = Schedule()
		expect(sched1.id).not.to.equal(sched2.id)
	})

	it('holds a schedule for a student', () => {
		let {id, active, year, semester, index, title, clbids} = sched

		expect(id).to.equal(1)
		expect(active).to.be.true
		expect(year).to.equal(1994)
		expect(semester).to.equal(3)
		expect(index).to.equal(2)
		expect(title).to.equal('My Schedule')
		expect(clbids).to.be.an('array')
		expect(clbids).to.deep.equal([123, 234, 345])
	})

	it('can turn into JSON', () => {
		let result = stringify(sched)
		expect(result).to.be.ok
	})

	it('does not stringify promises', () => {
		let result = JSON.parse(stringify(sched))
		expect(result).not.to.have.property('courses')
	})

	it('can change year and semester via moveSchedule', () => {
		let notMoved = moveSchedule(sched)
		let newYear = moveSchedule(sched, {year: 2012})
		let newSemester = moveSchedule(sched, {semester: 1})
		let allNew = moveSchedule(sched, {year: 2012, semester: 1})

		expect(notMoved).to.equal(sched)
		expect(newYear.year).to.equal(2012)
		expect(newSemester.semester).to.equal(1)

		expect(allNew.year).to.equal(2012)
		expect(allNew.semester).to.equal(1)
	})

	it('can be rearranged by reorderSchedule', () => {
		let newOrder = reorderSchedule(sched, 5)
		expect(newOrder.index).to.equal(5)
	})

	it('can be renamed by renameSchedule', () => {
		let newName = renameSchedule(sched, 'My New Title')
		expect(newName.title).to.equal('My New Title')
	})

	it('only translates some properties into the JSON bit', () => {
		let result = stringify(sched)
		expect(result).to.equal('{"active":true,"clbids":[123,234,345],"id":1,"index":2,"semester":3,"title":"My Schedule","year":1994}')
	})

	it('returns all of those properties, even the falsey ones', () => {
		let sched1 = Schedule({
			id: 1, active: false,
			title: 'My Schedule',
		})
		let result = stringify(sched1)
		expect(result).to.equal('{"active":false,"clbids":[],"id":1,"index":1,"semester":0,"title":"My Schedule","year":0}')
	})

	it('supports adding a course', () => {
		let addedCourse = addCourse(sched, 918)
		expect(addedCourse.clbids).to.contain(918)
	})

	it('refuses to add non-number clbids', () => {
		expect(() => addCourse(sched, '918')).to.throw(TypeError)
	})

	it('supports removing a course', () => {
		let removedCourse = removeCourse(sched, 123)
		expect(removedCourse.clbids).not.to.contain(123)
	})

	it('refuses to remove non-number clbids', () => {
		expect(() => removeCourse(sched, '918')).to.throw(TypeError)
	})

	it('supports rearranging courses', () => {
		let rearranged = reorderCourse(sched, 123, 2)
		expect(rearranged.clbids).to.not.deep.equal([123, 234, 345])
		expect(rearranged.clbids).to.deep.equal([234, 345, 123])
	})

	it('requires that the clbid be a number when rearranging', () => {
		expect(() => reorderCourse(sched, '918', 1)).to.throw(TypeError)
	})
})
