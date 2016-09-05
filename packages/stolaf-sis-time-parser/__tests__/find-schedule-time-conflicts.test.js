import test from 'ava'
import 'babel-core/register'
import findScheduleTimeConflicts from '../src/findScheduleTimeConflicts'

test('findScheduleTimeConflicts finds all time conflicts in a schedule', t => {
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

	t.same(findScheduleTimeConflicts(schedule), conflicts)
})

test('findScheduleTimeConflicts uses `true` to indicate a conflict', t => {
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

	t.same(findScheduleTimeConflicts(schedule), conflicts)
})

test('findScheduleTimeConflicts uses `false` to indicate not-a-conflict', t => {
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

	t.same(findScheduleTimeConflicts(schedule), conflicts)
})

test('findScheduleTimeConflicts uses `null` to indicate that the indices share the same course', t => {
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

	t.same(findScheduleTimeConflicts(schedule), conflicts)
})
