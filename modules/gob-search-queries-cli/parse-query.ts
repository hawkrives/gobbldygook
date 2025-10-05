import { buildQueryFromString } from "@gob/search-queries"
import { parseArgs } from "node:util"
import stringify from "stabilize"
import yaml from "js-yaml"

export function cli() {
  const { values: args, positionals } = parseArgs({
    options: {
      json: {
        type: "boolean",
        default: false,
      },
      yaml: {
        type: "boolean",
        default: false,
      },
    },
    allowPositionals: true,
  })

  if (positionals.length === 0) {
    console.error("Error: query is required")
    console.error("Usage: parse-query <query>")
    process.exit(1)
  }

  const query = buildQueryFromString(positionals[0])

  if (args.json) {
    console.log(stringify(query, { space: 4 }))
  } else if (args.yaml) {
    console.log(yaml.safeDump(query))
  } else {
    console.dir(query)
  }
}
