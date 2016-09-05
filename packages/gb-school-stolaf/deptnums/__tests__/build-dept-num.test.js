import test from 'ava'
import buildDeptNum from '../build-dept-num'

test('builds a department string from a single-dept course', t => {
	let ASIAN = {depts: ['ASIAN'], num: 175}

	t.is(buildDeptNum(ASIAN), 'ASIAN 175')
})

test('builds a department string from a multi-department course', t => {
	let ASRE = {depts: ['ASIAN', 'REL'], num: 230}

	t.is(buildDeptNum(ASRE), 'ASIAN/REL 230')
})

test('maintains the order of the departments array', t => {
	let BICH = {depts: ['BIO', 'CHEM'], num: 125}
	let CHBI = {depts: ['CHEM', 'BIO'], num: 125}

	t.is(buildDeptNum(BICH), 'BIO/CHEM 125')
	t.is(buildDeptNum(CHBI), 'CHEM/BIO 125')
})

test('handles sections', t => {
	let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

	t.is(buildDeptNum(AMCON, true), 'AMCON 201A')
})

test('only handles sections when told to', t => {
	let AMCON = {depts: ['AMCON'], num: 201, sect: 'A'}

	t.is(buildDeptNum(AMCON), 'AMCON 201')
})
