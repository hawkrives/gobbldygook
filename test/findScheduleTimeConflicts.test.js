// test/findScheduleTimeConflicts.test.js
import findScheduleTimeConflicts from '../lib/findScheduleTimeConflicts'

describe('findScheduleTimeConflicts', () => {
	it('finds all time conflicts in a schedule', () => {
		let schedule = [
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1600}, {start:905, end:1000}]},
				{day: 'Tu', times:[{start:1300, end:1600}]},
				{day: 'Fr', times:[{start:905, end:1000}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1400}, {start:905, end:1000}]},
				{day: 'Tu', times:[{start:1300, end:1400}]},
				{day: 'We', times:[{start:1300, end:1400}]},
				{day: 'Th', times:[{start:1300, end:1400}]},
				{day: 'Fr', times:[{start:905, end:1000}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:400, end:600}]},
			]},
		]

		let conflicts = [
			[null, true, false],
			[true, null, false],
			[false, false, null],
		]

		expect(findScheduleTimeConflicts(schedule)).to.eql(conflicts)
	})

	it('uses `true` to indicate a conflict', () => {
		let schedule = [
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1600}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1400}]},
			]},
		]

		let conflicts = [
			[null, true],
			[true, null],
		]

		expect(findScheduleTimeConflicts(schedule)).to.eql(conflicts)
	})

	it('uses `false` to indicate not-a-conflict', () => {
		let schedule = [
			{offerings: [
				{day: 'Mo', times:[{start:1000, end:1200}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1400}]},
			]},
		]

		let conflicts = [
			[null, false],
			[false, null],
		]

		expect(findScheduleTimeConflicts(schedule)).to.eql(conflicts)
	})

	it('uses `null` to indicate that the indices share the same course', () => {
		let schedule = [
			{offerings: [
				{day: 'Mo', times:[{start:1000, end:1200}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1300, end:1400}]},
			]},
			{offerings: [
				{day: 'Mo', times:[{start:1000, end:1400}]},
			]},
		]

		let conflicts = [
			[null, false, true],
			[false, null, true],
			[true, true, null],
		]

		expect(findScheduleTimeConflicts(schedule)).to.eql(conflicts)
	})
})
