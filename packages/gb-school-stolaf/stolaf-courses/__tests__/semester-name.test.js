import test from 'ava'
import semesterName from '../semester-name'

test('converts a semester number to a semester name', t => {
	t.is(semesterName(0), 'Abroad')
	t.is(semesterName(1), 'Fall')
	t.is(semesterName(2), 'Interim')
	t.is(semesterName(3), 'Spring')
	t.is(semesterName(4), 'Summer Session 1')
	t.is(semesterName(5), 'Summer Session 2')
	t.is(semesterName(6), 'Unknown (6)')
	t.is(semesterName(9), 'Non-St. Olaf')
})
