/* globals __dirname */
/* eslint no-confusing-arrow: 0 */

import peg from 'pegjs'
import fs from 'fs'
import path from 'path'
import {splitDeptNum} from 'modules/schools/stolaf'
import mapKeys from 'lodash/mapKeys'

const grammar = fs.readFileSync(path.join(__dirname, '../../parse-hanson-string.pegjs'), 'utf-8')
export const customParser = (...args) => peg.generate(grammar, ...args).parse


export const courseDeclr = deptnum => mapKeys(splitDeptNum(deptnum), (v, k) => k === 'departments' ? 'department' : k)

export const course = deptnum => ({
	$type: 'course',
	$course: courseDeclr(deptnum),
})

export const boolean = (type, contents) => ({
	$type: 'boolean',
	[`$${type}`]: contents,
})

export const counter = (type, val) => ({
	$num: val,
	$operator: `$${type}`,
})

export const reference = to => ({
	$type: 'reference',
	$requirement: to,
})
