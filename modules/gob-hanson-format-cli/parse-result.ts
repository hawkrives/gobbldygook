const { parse } = require("@gob/hanson-format")
const { parseArgs } = require("node:util")
const stringify = require("stabilize")
const yaml = require("js-yaml")
const util = require("util")
const getStdin = require("get-stdin")

function parseString(args, string) {
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

module.exports.cli = function cli() {
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

  args.string = positionals[0]

  if (args.stdin) {
    getStdin()
      .then((string) => parseString(args, string))
      .catch((err) => {
        throw err
      })
  } else {
    parseString(args, args.string)
  }
}

process.on("unhandledRejection", (reason) => {
  console.error(reason)
})
