import loadArea from './load-area'
import { readFileSync } from 'graceful-fs'
import yaml from 'js-yaml'

export default async function loadStudent(filename, { isFile=true }={}) {
  let contents
  if (isFile) {
    contents = readFileSync(filename, 'utf-8')
  }
  else {
    contents = filename
  }
  let data = yaml.safeLoad(contents)
  data.areas = await Promise.all(data.areas.map(loadArea))
  data.filename = isFile ? filename : '<unknown>'
  return data
}
