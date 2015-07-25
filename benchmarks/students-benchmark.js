import fs from 'graceful-fs'
import info from '../package.json'

import evaluate from '../src/lib/evaluate'

import includes from 'lodash/collection/includes'
import junk from 'junk'
import meow from 'meow'
import ms from 'pretty-ms'
import range from 'lodash/utility/range'
import size from 'lodash/collection/size'
import sparkly from 'sparkly'
import sum from 'lodash/collection/sum'
import loadArea from '../bin/load-area'

function now(other=[]) {
    let time = process.hrtime(other)
    return time[0] * 1e3 + time[1] / 1e6
}

function loadStudents(dir) {
    return fs.readdirSync(dir)
        .filter(name => !includes(name, '.ip'))
        .filter(junk.not)
        .map(path => dir + path)
        .map(path => fs.readFileSync(path, 'utf-8'))
        .map(JSON.parse)
}

function benchmark({runs, graph}) {
    loadStudents('./test/example-students/')
        .forEach(({courses=[], overrides={}, areas=[]}) => {
            areas.forEach(areaInfo => {
                console.log(`the '${areaInfo.name}' ${areaInfo.type} (${areaInfo.revision})`)
                let areaData = loadArea(areaInfo)
                let times = range(runs).map(() => {
                    const start = process.hrtime()
                    evaluate({courses, overrides}, areaData)
                    return now(start)
                })

                const avg = sum(times) / size(times)
                if (graph) {
                    console.log(`  ${sparkly(times)}\n`)
                }
                console.log(`  average time: ${ms(avg)} (over ${runs} runs)\n`)
            })
        })
}

function cli() {
    const args = meow({
        help: `
            Usage
              node students-benchmark [-r, --runs <number>] [--(no-)graph]
        `,
        pkg: info,
    })

    if (args.flags.args) {
        console.log(args.flags)
    }

    const runs = args.flags.r || args.flags.runs || 50
    const graph = args.flags.graph
    benchmark({runs, graph})
}

if (require.main === module) {
    cli()
}
