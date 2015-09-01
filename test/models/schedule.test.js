// test/models/schedule.test.js
import Schedule from '../../src/models/schedule.js'
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
		expect(sched instanceof Schedule).to.be.true
	})

	it('can be turned into a JS object', () => {
		expect(sched.toJS() instanceof Object).to.be.true
	})

	it('does not mutate the passed-in object', () => {
		const clbids = []
		const input = {clbids}
		new Schedule(input)
		expect(input.clbids).to.equal(clbids)
	})

	it('ignores sets on known properties', () => {
		try {
			sched.index = 3
		}
		catch (err) {}
		expect(sched.index).to.equal(2)
	})

	it('uses the ID that you give it', () => {
		expect(sched.id).to.equal(1)
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = new Schedule()
		let sched2 = new Schedule()
		expect(sched1.id).not.to.equal(sched2.id)
	})

	it('converts the JS array of clbids to an Immutable.List', () => {
		expect(List.isList(sched.clbids)).to.be.true
	})

	it('holds a schedule for a student', () => {
		let {id, active, year, semester, index, title, clbids} = sched

		expect(id).to.equal(1)
		expect(active).to.be.true
		expect(year).to.equal(1994)
		expect(semester).to.equal(3)
		expect(index).to.equal(2)
		expect(title).to.equal('My Schedule')
		expect(List.isList(clbids)).to.be.true
		expect(clbids.toArray()).to.deep.equal([123, 234, 345])
	})

	it('can turn into JSON', () => {
		let result = JSON.stringify(sched)
		expect(result).to.be.ok
	})

	it('returns _courseData for .courses', () => {
		expect(sched.courses).to.equal(sched._courseData)
	})

	it('can change year and semester by the .move method', () => {
		let notMoved = sched.move()
		let newYear = sched.move({year: 2012})
		let newSemester = sched.move({semester: 1})
		let allNew = sched.move({year: 2012, semester: 1})

		expect(notMoved).to.equal(sched)
		expect(newYear.year).to.equal(2012)
		expect(newSemester.semester).to.equal(1)

		expect(allNew.year).to.equal(2012)
		expect(allNew.semester).to.equal(1)
	})

	it('can be rearranged by .reorder', () => {
		let newOrder = sched.reorder(5)
		expect(newOrder.index).to.equal(5)
	})

	it('can be renamed by .rename', () => {
		let newName = sched.rename('My New Title')
		expect(newName.title).to.equal('My New Title')
	})

	it('only translates some properties into the JSON bit', () => {
		let result = JSON.stringify(sched)
		expect(result).to.equal('{"id":1,"active":true,"year":1994,"semester":3,"index":2,"title":"My Schedule","clbids":[123,234,345]}')
		expect(JSON.parse(result)._courseData).to.be.undefined
	})

	it('returns all of those properties, even the falsey ones', () => {
		let sched1 = new Schedule({
			id: 1, active: false,
			title: 'My Schedule',
		})
		let result = JSON.stringify(sched1)
		expect(result).to.equal('{"id":1,"active":false,"year":0,"semester":0,"index":1,"title":"My Schedule","clbids":[]}')
		expect(JSON.parse(result)._courseData).to.be.undefined
	})

	it('supports adding a course', () => {
		let addedCourse = sched.addCourse(918)
		expect(addedCourse.clbids.toArray()).to.contain(918)
	})

	it('refuses to add non-number clbids', () => {
		expect(() => sched.addCourse('918')).to.throw(TypeError)
	})

	it('supports removing a course', () => {
		let removedCourse = sched.removeCourse(123)
		expect(removedCourse.clbids.toArray()).not.to.contain(123)
	})

	it('refuses to remove non-number clbids', () => {
		expect(() => sched.addCourse('918')).to.throw(TypeError)
	})

	it('supports rearranging courses', () => {
		let rearranged = sched.reorderCourse(123, 2)
		expect(rearranged.clbids.toArray()).to.not.deep.equal([123, 234, 345])
		expect(rearranged.clbids.toArray()).to.deep.equal([234, 345, 123])
	})

	it('requires that the clbid be a number when rearranging', () => {
		expect(() => sched.reorderCourse('918', 1)).to.throw(TypeError)
	})
})
