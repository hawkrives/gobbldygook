import meow from 'meow'
import pkg from '../package.json'
import fs from 'graceful-fs'
import yaml from 'js-yaml'
import enhanceHanson from '../lib/enhance-hanson'

export function cli() {
    const args = meow({
        pkg,
        help: `Usage:
            compile areaFile`,
    })

    const [filename] = args.input

    if (filename) {
        const data = fs.readFileSync(filename, {encoding: 'utf-8'})
        const obj = yaml.safeLoad(data)
        const enhanced = enhanceHanson(obj, {topLevel: true})
        console.log(JSON.stringify(enhanced, null, 2))
    }
    else {
        args.showHelp()
    }
}
