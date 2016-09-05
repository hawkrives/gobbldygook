import test from 'ava'
import stringify from 'json-stable-stringify'
import Schedule from '../schedule'

test('does not mutate the passed-in object', t => {
	const clbids = []
	const input = {clbids}
	Schedule(input)
	t.deepEqual(input.clbids, clbids)
})

test('uses the ID that you give it', t => {
	let schedule = Schedule({id: '1'})
	t.is(schedule.id, '1')
})

test('throws if the ID is not a string', t => {
	t.throws(() => Schedule({id: 1}), TypeError)
})

test('creates a unique ID for each new schedule without an ID prop', t => {
	let sched1 = Schedule()
	let sched2 = Schedule()
	t.not(sched1.id, sched2.id)
})

test('holds a schedule for a student', t => {
	let sched = Schedule({
		id: '1',
		active: true,
		year: 1994,
		semester: 3,
		index: 2,
		title: 'My Schedule',
		clbids: [123, 234, 345],
	})
	t.is(sched.id, '1')
	t.true(sched.active)
	t.is(sched.year, 1994)
	t.is(sched.semester, 3)
	t.is(sched.index, 2)
	t.is(sched.title, 'My Schedule')
	t.true(Array.isArray(sched.clbids))
	t.deepEqual(sched.clbids, [123, 234, 345])
})

test('can turn into JSON', t => {
	let result = stringify(Schedule())
	t.truthy(result)
})
