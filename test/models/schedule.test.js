import {expect} from 'chai'
import stringify from 'json-stable-stringify'

const Schedule = require('../../src/models/schedule')

describe('Schedule', () => {
	it('does not mutate the passed-in object', () => {
		const clbids = []
		const input = {clbids}
		Schedule(input)
		expect(input.clbids).to.equal(clbids)
	})

	it('uses the ID that you give it', () => {
		let schedule = Schedule({id: '1'})
		expect(schedule.id).to.equal('1')
	})

	it('throws if the ID is not a string', () => {
		expect(() => Schedule({id: 1})).to.throw(TypeError)
	})

	it('creates a unique ID for each new schedule without an ID prop', () => {
		let sched1 = Schedule()
		let sched2 = Schedule()
		expect(sched1.id).not.to.equal(sched2.id)
	})

	it('holds a schedule for a student', () => {
		let sched = Schedule({
			id: '1',
			active: true,
			year: 1994,
			semester: 3,
			index: 2,
			title: 'My Schedule',
			clbids: [123, 234, 345],
		})
		expect(sched.id).to.equal('1')
		expect(sched.active).to.be.true
		expect(sched.year).to.equal(1994)
		expect(sched.semester).to.equal(3)
		expect(sched.index).to.equal(2)
		expect(sched.title).to.equal('My Schedule')
		expect(sched.clbids).to.be.an('array')
		expect(sched.clbids).to.deep.equal([123, 234, 345])
	})

	it('can turn into JSON', () => {
		let result = stringify(Schedule())
		expect(result).to.be.ok
	})
})
