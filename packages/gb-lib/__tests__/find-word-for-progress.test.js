import test from 'ava'
import findWordForProgress from '../find-word-for-progress'

test('properly handles each tenth of the float', t => {
	t.is(findWordForProgress(100, 100), 'hundred')
	t.is(findWordForProgress(100, 90), 'ninety')
	t.is(findWordForProgress(100, 80), 'eighty')
	t.is(findWordForProgress(100, 70), 'seventy')
	t.is(findWordForProgress(100, 60), 'sixty')
	t.is(findWordForProgress(100, 50), 'fifty')
	t.is(findWordForProgress(100, 40), 'forty')
	t.is(findWordForProgress(100, 30), 'thirty')
	t.is(findWordForProgress(100, 20), 'twenty')
	t.is(findWordForProgress(100, 10), 'ten')
	t.is(findWordForProgress(100, 0), 'zero')
})

test('handles numbers between tenths of a float', t => {
	t.is(findWordForProgress(100, 75.52313), 'seventy')
})
