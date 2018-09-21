/* eslint-env jest */

import {findTimeConflicts, checkCoursesForTimeConflicts, removeColon} from '../index'

test('times sort properly as strings', () => {
	expect(removeColon('1:00') < removeColon('14:00')).toBe(true)
	expect(removeColon('12:00') < removeColon('14:00')).toBe(true)
	expect(removeColon('15:00') < removeColon('14:00')).toBe(false)
	expect(removeColon('14:00') <= removeColon('14:00')).toBe(true)
	expect(removeColon('24:00') > removeColon('1:00')).toBe(true)
})

test('checks for course time conflicts', () => {
	let c1 = {
		offerings: [
			{day: 'Mo', start: '9:05', end: '10:00'},
			{day: 'Mo', start: '9:05', end: '10:00'},
			{day: 'Tu', start: '13:00', end: '16:00'},
			{day: 'Fr', start: '9:05', end: '10:00'},
		],
	}

	let c2 = {
		offerings: [
			{day: 'Mo', start: '13:00', end: '14:00'},
			{day: 'Mo', start: '9:05', end: '10:00'},
			{day: 'Tu', start: '13:00', end: '14:00'},
			{day: 'We', start: '13:00', end: '14:00'},
			{day: 'Th', start: '13:00', end: '14:00'},
			{day: 'Fr', start: '9:05', end: '10:00'},
		],
	}

	let c3 = {
		offerings: [{day: 'Mo', start: '4:00', end: '6:00'}],
	}

	expect(checkCoursesForTimeConflicts(c1, c2)).toBe(true)
	expect(checkCoursesForTimeConflicts(c1, c3)).toBe(false)
	expect(checkCoursesForTimeConflicts(c2, c3)).toBe(false)
})

test('finds all time conflicts in a schedule', () => {
	let schedule = [
		{
			offerings: [
				{day: 'Mo', start: '13:00', end: '16:00'},
				{day: 'Mo', start: '9:05', end: '10:00'},
				{day: 'Tu', start: '13:00', end: '16:00'},
				{day: 'Fr', start: '9:05', end: '10:00'},
			],
		},
		{
			offerings: [
				{day: 'Mo', start: '13:00', end: '14:00'},
				{day: 'Mo', start: '9:05', end: '10:00'},
				{day: 'Tu', start: '13:00', end: '14:00'},
				{day: 'We', start: '13:00', end: '14:00'},
				{day: 'Th', start: '13:00', end: '14:00'},
				{day: 'Fr', start: '9:05', end: '10:00'},
			],
		},
		{
			offerings: [{day: 'Mo', start: '4:00', end: '6:00'}],
		},
	]

	let conflicts = [
		[null, true, false],
		[true, null, false],
		[false, false, null],
	]

	expect(findTimeConflicts(schedule)).toEqual(conflicts)
})

test('uses `true` to indicate a conflict', () => {
	let schedule = [
		{offerings: [{day: 'Mo', start: '13:00', end: '16:00'}]},
		{offerings: [{day: 'Mo', start: '13:00', end: '14:00'}]},
	]

	let conflicts = [[null, true], [true, null]]

	expect(findTimeConflicts(schedule)).toEqual(conflicts)
})

test('uses `false` to indicate not-a-conflict', () => {
	let schedule = [
		{offerings: [{day: 'Mo', start: '10:00', end: '12:00'}]},
		{offerings: [{day: 'Mo', start: '13:00', end: '14:00'}]},
	]

	let conflicts = [[null, false], [false, null]]

	expect(findTimeConflicts(schedule)).toEqual(conflicts)
})

test('uses `null` to indicate that the indices share the same course', () => {
	let schedule = [
		{offerings: [{day: 'Mo', start: '10:00', end: '12:00'}]},
		{offerings: [{day: 'Mo', start: '13:00', end: '14:00'}]},
		{offerings: [{day: 'Mo', start: '10:00', end: '14:00'}]},
	]

	let conflicts = [
		[null, false, true],
		[false, null, true],
		[true, true, null],
	]

	expect(findTimeConflicts(schedule)).toEqual(conflicts)
})

test('checks if there is a time conflict in a schedule', () => {
	let schedule = [
		{
			offerings: [
				{day: 'Mo', start: '13:00', end: '16:00'},
				{day: 'Mo', start: '9:05', end: '10:00'},
				{day: 'Tu', start: '13:00', end: '16:00'},
				{day: 'Fr', start: '9:05', end: '10:00'},
			],
		},
		{
			offerings: [
				{day: 'Mo', start: '13:00', end: '14:00'},
				{day: 'Mo', start: '9:05', end: '10:00'},
				{day: 'Tu', start: '13:00', end: '14:00'},
				{day: 'We', start: '13:00', end: '14:00'},
				{day: 'Th', start: '13:00', end: '14:00'},
				{day: 'Fr', start: '9:05', end: '10:00'},
			],
		},
		{
			offerings: [{day: 'Mo', start: '4:00', end: '6:00'}],
		},
	]

	let actual = findTimeConflicts(schedule)

	let any = actual.some(vals => vals.some(v => v === true))

	expect(any).toBe(true)
})
