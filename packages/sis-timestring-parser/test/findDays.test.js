import test from 'ava'
import 'babel-core/register'
import findDays from '../src/findDays'

test('findDays turns the day abbreviations into a list of unambiguous days', t => {
	t.same(findDays('M'), ['Mo'])
	t.same(findDays('T'), ['Tu'])
	t.same(findDays('W'), ['We'])
	t.same(findDays('Th'), ['Th'])
	t.same(findDays('F'), ['Fr'])
})

test('findDays handles hyphenated day sequences', t => {
	t.same(findDays('M-F'), ['Mo', 'Tu', 'We', 'Th', 'Fr'])
	t.same(findDays('M-Th'), ['Mo', 'Tu', 'We', 'Th'])
	t.same(findDays('T-F'), ['Tu', 'We', 'Th', 'Fr'])
	t.same(findDays('M-T'), ['Mo', 'Tu'])
})

test('findDays handles strings of letters correctly', t => {
	t.same(findDays('MTThFW'), ['Mo', 'Tu', 'Th', 'Fr', 'We'])
	t.same(findDays('MTTh'), ['Mo', 'Tu', 'Th'])
	t.same(findDays('ThFMT'), ['Th', 'Fr', 'Mo', 'Tu'])
})

test('findDays correctly parses every variant that the SIS contains', t => {
	t.same(findDays('F'), ['Fr'])
	t.same(findDays('M'), ['Mo'])
	t.same(findDays('M-F'), ['Mo', 'Tu', 'We', 'Th', 'Fr'])
	t.same(findDays('M-Th'), ['Mo', 'Tu', 'We', 'Th'])
	t.same(findDays('MF'), ['Mo', 'Fr'])
	t.same(findDays('MFW'), ['Mo', 'Fr', 'We'])
	t.same(findDays('MT'), ['Mo', 'Tu'])
	t.same(findDays('MTF'), ['Mo', 'Tu', 'Fr'])
	t.same(findDays('MTTh'), ['Mo', 'Tu', 'Th'])
	t.same(findDays('MTThF'), ['Mo', 'Tu', 'Th', 'Fr'])
	t.same(findDays('MTThFW'), ['Mo', 'Tu', 'Th', 'Fr', 'We'])
	t.same(findDays('MTW'), ['Mo', 'Tu', 'We'])
	t.same(findDays('MTWF'), ['Mo', 'Tu', 'We', 'Fr'])
	t.same(findDays('MTh'), ['Mo', 'Th'])
	t.same(findDays('MW'), ['Mo', 'We'])
	t.same(findDays('MWF'), ['Mo', 'We', 'Fr'])
	t.same(findDays('MWFT'), ['Mo', 'We', 'Fr', 'Tu'])
	t.same(findDays('MWTh'), ['Mo', 'We', 'Th'])
	t.same(findDays('MWThF'), ['Mo', 'We', 'Th', 'Fr'])
	t.same(findDays('T'), ['Tu'])
	t.same(findDays('T-F'), ['Tu', 'We', 'Th', 'Fr'])
	t.same(findDays('TTh'), ['Tu', 'Th'])
	t.same(findDays('TThF'), ['Tu', 'Th', 'Fr'])
	t.same(findDays('TW'), ['Tu', 'We'])
	t.same(findDays('TWF'), ['Tu', 'We', 'Fr'])
	t.same(findDays('TWTh'), ['Tu', 'We', 'Th'])
	t.same(findDays('Th'), ['Th'])
	t.same(findDays('W'), ['We'])
	t.same(findDays('WF'), ['We', 'Fr'])
	t.same(findDays('WTh'), ['We', 'Th'])
})
