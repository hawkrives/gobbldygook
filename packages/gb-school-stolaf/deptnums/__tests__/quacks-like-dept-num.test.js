import test from 'ava'
import quacksLikeDeptNum from '../quacks-like-dept-num'

test('fails on the empty string', t => {
	t.false(quacksLikeDeptNum(''))
})

test('handles multi-department courses', t => {
	t.true(quacksLikeDeptNum('AS/RE 250'))
})

test('handles single-department courses', t => {
	t.true(quacksLikeDeptNum('ASIAN 275'))
})

test('requires that there be a department and a number', t => {
	t.true(quacksLikeDeptNum('AMCON 100'))
})

test('requires that the number be comprised entirely of numbers', t => {
	t.false(quacksLikeDeptNum('ASIAN 9XX'))
})

test('can also handle sections', t => {
	t.true(quacksLikeDeptNum('ASIAN 220B'))
})

test('expects the section to be a single letter', t => {
	t.true(quacksLikeDeptNum('ASIAN 220B'))
})

test('handles two-letter departments', t => {
	t.true(quacksLikeDeptNum('ID 220'))
})

test('cares not how many spaces are between the dept and num', t => {
	t.true(quacksLikeDeptNum('ASIAN    192'))
	t.true(quacksLikeDeptNum('ASIAN192'))
})

test('cares not how many spaces are between the num and the sect', t => {
	t.true(quacksLikeDeptNum('ASIAN192B'))
	t.true(quacksLikeDeptNum('ASIAN192 B'))
	t.true(quacksLikeDeptNum('ASIAN192    B'))
})
