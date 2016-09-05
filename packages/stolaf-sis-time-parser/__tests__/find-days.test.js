import test from 'ava'
import findDays from '../src/find-days'

test('turns the day abbreviations into a list of unambiguous days', t => {
	t.deepEqual(findDays('M'), ['Mo'])
	t.deepEqual(findDays('T'), ['Tu'])
	t.deepEqual(findDays('W'), ['We'])
	t.deepEqual(findDays('Th'), ['Th'])
	t.deepEqual(findDays('F'), ['Fr'])
})

test('handles hyphenated day sequences', t => {
	t.deepEqual(findDays('M-F'), ['Mo', 'Tu', 'We', 'Th', 'Fr'])
	t.deepEqual(findDays('M-Th'), ['Mo', 'Tu', 'We', 'Th'])
	t.deepEqual(findDays('T-F'), ['Tu', 'We', 'Th', 'Fr'])
	t.deepEqual(findDays('M-T'), ['Mo', 'Tu'])
})

test('handles strings of letters correctly', t => {
	t.deepEqual(findDays('MTThFW'), ['Mo', 'Tu', 'Th', 'Fr', 'We'])
	t.deepEqual(findDays('MTTh'), ['Mo', 'Tu', 'Th'])
	t.deepEqual(findDays('ThFMT'), ['Th', 'Fr', 'Mo', 'Tu'])
})

test('correctly parses every variant that the SIS contains', t => {
	t.deepEqual(findDays('F'), ['Fr'])
	t.deepEqual(findDays('M'), ['Mo'])
	t.deepEqual(findDays('M-F'), ['Mo', 'Tu', 'We', 'Th', 'Fr'])
	t.deepEqual(findDays('M-Th'), ['Mo', 'Tu', 'We', 'Th'])
	t.deepEqual(findDays('MF'), ['Mo', 'Fr'])
	t.deepEqual(findDays('MFW'), ['Mo', 'Fr', 'We'])
	t.deepEqual(findDays('MT'), ['Mo', 'Tu'])
	t.deepEqual(findDays('MTF'), ['Mo', 'Tu', 'Fr'])
	t.deepEqual(findDays('MTTh'), ['Mo', 'Tu', 'Th'])
	t.deepEqual(findDays('MTThF'), ['Mo', 'Tu', 'Th', 'Fr'])
	t.deepEqual(findDays('MTThFW'), ['Mo', 'Tu', 'Th', 'Fr', 'We'])
	t.deepEqual(findDays('MTW'), ['Mo', 'Tu', 'We'])
	t.deepEqual(findDays('MTWF'), ['Mo', 'Tu', 'We', 'Fr'])
	t.deepEqual(findDays('MTh'), ['Mo', 'Th'])
	t.deepEqual(findDays('MW'), ['Mo', 'We'])
	t.deepEqual(findDays('MWF'), ['Mo', 'We', 'Fr'])
	t.deepEqual(findDays('MWFT'), ['Mo', 'We', 'Fr', 'Tu'])
	t.deepEqual(findDays('MWTh'), ['Mo', 'We', 'Th'])
	t.deepEqual(findDays('MWThF'), ['Mo', 'We', 'Th', 'Fr'])
	t.deepEqual(findDays('T'), ['Tu'])
	t.deepEqual(findDays('T-F'), ['Tu', 'We', 'Th', 'Fr'])
	t.deepEqual(findDays('TTh'), ['Tu', 'Th'])
	t.deepEqual(findDays('TThF'), ['Tu', 'Th', 'Fr'])
	t.deepEqual(findDays('TW'), ['Tu', 'We'])
	t.deepEqual(findDays('TWF'), ['Tu', 'We', 'Fr'])
	t.deepEqual(findDays('TWTh'), ['Tu', 'We', 'Th'])
	t.deepEqual(findDays('Th'), ['Th'])
	t.deepEqual(findDays('W'), ['We'])
	t.deepEqual(findDays('WF'), ['We', 'Fr'])
	t.deepEqual(findDays('WTh'), ['We', 'Th'])
})
