import test from 'ava'
import {to12Hour} from '../to-12-hour-time'

test('converts a 24-hour military-style time string into a 12-hour time string', t => {
	t.is(to12Hour('1300'), '1:00pm')
})

test('handles minutes', t => {
	t.is(to12Hour('1310'), '1:10pm')
	t.is(to12Hour('1345'), '1:45pm')
})

test('works in am', t => {
	t.is(to12Hour('1010'), '10:10am')
})

test('works in pm', t => {
	t.is(to12Hour('2010'), '8:10pm')
})

test('accepts 0-padded times', t => {
	t.is(to12Hour('0810'), '8:10am')
})

test('accepts unpadded times', t => {
	t.is(to12Hour('810'), '8:10am')
})

test('does not convert minutes ≥ 60 into additional hours', t => {
	t.is(to12Hour('870'), '8:70am')
	t.not(to12Hour('870'), '9:10am')
})
