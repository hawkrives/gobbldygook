import test from 'ava'
import {randomChar} from '../random-char'

test('finds a random integer between the parameters', t => {
	t.regex(randomChar(), /[a-z0-9]/)
	t.regex(randomChar(), /[a-z0-9]/)
})
