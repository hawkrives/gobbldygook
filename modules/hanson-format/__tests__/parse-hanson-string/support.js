/* globals __dirname */

import peg from 'pegjs'
import fs from 'fs'
import path from 'path'

const grammar = fs.readFileSync(path.join(__dirname, '../../parse-hanson-string.pegjs'), 'utf-8')
export const customParser = (...args) => peg.generate(grammar, ...args).parse
