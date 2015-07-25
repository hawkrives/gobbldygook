import kebabCase from 'lodash/string/kebabCase'
import yaml from 'js-yaml'
import enhanceHanson from '../src/lib/enhance-hanson'
import pluralizeArea from '../src/lib/pluralize-area'
import path from 'path'
import fs from 'graceful-fs'

export default function loadArea({name, type/*, revision*/}) {
    const filepath = path.join('area-data', pluralizeArea(type), `${kebabCase(name)}.yaml`)
    const data = fs.readFileSync(filepath, {encoding: 'utf-8'})
    const obj = yaml.safeLoad(data)
    return enhanceHanson(obj, {topLevel: true})
}
