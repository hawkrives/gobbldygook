/* globals __dirname */

import peg from 'pegjs'
import fs from 'fs'
import path from 'path'
import {splitDeptNum} from 'modules/schools/stolaf'
import mapKeys from 'lodash/mapKeys'

const grammar = fs.readFileSync(path.join(__dirname, '../../parse-hanson-string.pegjs'), 'utf-8')
export const customParser = (...args) => peg.generate(grammar, ...args).parse


export const course = deptnum => ({
	$type: 'course',
	$course: mapKeys(splitDeptNum(deptnum), (v, k) => k === 'departments' ? 'department' : k),
})
