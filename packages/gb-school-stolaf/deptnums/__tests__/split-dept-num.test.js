import test from 'ava'
import splitDeptNum from '../split-dept-num'

test('splits multi-department courses into components', t => {
	let asre = 'AS/RE 250'
	let asianrel = 'ASIAN/REL 250'

	t.deepEqual(splitDeptNum(asre), {depts: ['AS', 'RE'], num: 250})
	t.deepEqual(splitDeptNum(asianrel), {depts: ['ASIAN', 'REL'], num: 250})
})

test('splits up a single department course into components', t => {
	let deptnum = 'ASIAN 275'

	t.deepEqual(splitDeptNum(deptnum), {depts: ['ASIAN'], num: 275})
})

test('includes the section, if given', t => {
	let deptnum = 'ASIAN 275A'

	t.deepEqual(splitDeptNum(deptnum, true), {depts: ['ASIAN'], num: 275, sect: 'A'})
})
