/* globals __dirname */

import {parseHtml} from '../../parse-html'
import fs from 'fs'
import path from 'path'
const file = filename => fs.readFileSync(path.join(__dirname, `./__support__/import-student.${filename}.html`))

export const loadHtml = filename => parseHtml(file(filename))
