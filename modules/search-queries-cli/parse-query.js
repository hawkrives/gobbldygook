import { buildQueryFromString } from '../search-queries/build-query-from-string'
import nom from 'nomnom'
import stringify from 'stabilize'
import yaml from 'js-yaml'

export function cli() {
    const args = nom
        .option('json', { flag: true, help: 'Print the result as valid JSON' })
        .option('yaml', { flag: true, help: 'Print the result as YAML' })
        .option('query', { position: 0, required: true })
        .parse()

    const query = buildQueryFromString(args.query)

    if (args.json) {
        console.log(stringify(query, { space: 4 }))
    } else if (args.yaml) {
        console.log(yaml.safeDump(query))
    } else {
        console.dir(query)
    }
}
