import { parse } from "@gob/hanson-format"
import { parseArgs } from "node:util"
import util from "node:util"
import stringify from "stabilize"
import yaml from "js-yaml"
import getStdin from "get-stdin"

type Args = {
  json: boolean
  yaml: boolean
}

function parseString(args: Args, string: string) {
  if (string.length === 0) {
    throw new Error("Either --stdin or an argument is required")
  }

  const parsed = parse(string)

  if (args.json) {
    console.log(stringify(parsed, { space: 4 }))
  } else if (args.yaml) {
    console.log(yaml.safeDump(parsed))
  } else {
    console.log(util.inspect(parsed, { depth: null }))
  }
}

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
      stdin: {
        type: "boolean",
        default: false,
      },
    },
    allowPositionals: true,
  })

  if (args.stdin) {
    getStdin()
      .then((string) => {
        parseString(args, string)
      })
      .catch((err: unknown) => {
        console.error(err)
        process.exitCode = 1
      })
  } else {
    parseString(args, positionals[0] ?? "")
  }
}
