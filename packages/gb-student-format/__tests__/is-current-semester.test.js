import test from 'ava'
import isCurrentSemester from '../is-current-semester'

test('checks if a schedule is in the given semester', t => {
	t.true(isCurrentSemester(2012, 2)({year: 2012, semester: 2}))
})
