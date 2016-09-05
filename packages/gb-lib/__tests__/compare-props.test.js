import test from 'ava'
import compareProps from '../compare-props'

test('compares two prop objects', t => {
	let propsA = {p: 1}
	let propsB = {p: 2}
	t.true(compareProps(propsA, propsB))
})

test('shallowly compares two prop objects', t => {
	let nested = {v: 1}
	let propsA = {p: nested}
	let propsB = {p: nested}
	t.false(compareProps(propsA, propsB))
})

test('does not compare object identity', t => {
	let propsA = {p: 1}
	let propsB = {p: 1}
	t.false(compareProps(propsA, propsB))
})
