import test from 'ava'
import 'babel-core/register'
import checkScheduleForTimeConflicts from '../src/checkScheduleForTimeConflicts'

test('checkScheduleForTimeConflicts checks if there is a time conflict in a schedule', t => {
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

	t.true(checkScheduleForTimeConflicts(schedule))
})
