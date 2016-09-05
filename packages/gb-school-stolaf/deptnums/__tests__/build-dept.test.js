import test from 'ava'
import buildDept from '../build-dept'

test('builds a department string from a single-dept course', t => {
	let ASIAN = {depts: ['ASIAN']}

	t.is(buildDept(ASIAN), 'ASIAN')
})

test('builds a department string from a multi-department course', t => {
	let ASRE = {depts: ['ASIAN', 'REL']}

	t.is(buildDept(ASRE), 'ASIAN/REL')
})

test('maintains the order of the departments array', t => {
	let BICH = {depts: ['BIO', 'CHEM']}
	let CHBI = {depts: ['CHEM', 'BIO']}

	t.is(buildDept(BICH), 'BIO/CHEM')
	t.is(buildDept(CHBI), 'CHEM/BIO')
})

test('maintains the order of the departments array even after shrinking', t => {
	let BICH = {depts: ['BIOLOGY', 'CHEMISTRY']}
	let CHBI = {depts: ['CHEMISTRY', 'BIOLOGY']}

	t.is(buildDept(BICH), 'BIO/CHEM')
	t.is(buildDept(CHBI), 'CHEM/BIO')
})

test('properly condenses department names into abbrs', t => {
	let course = {depts: ['RELIGION']}
	t.is(buildDept(course), 'REL')
})

test('properly expands department short abbrs into abbrs', t => {
	let course = {depts: ['AS', 'RE']}

	t.is(buildDept(course), 'ASIAN/REL')
})

test('doesn\'t modify the depts property', t => {
	let course = {depts: ['AS', 'RE']}
	let safecourse = {depts: ['AS', 'RE']}

	buildDept(course)

	t.deepEqual(course, safecourse)
})
