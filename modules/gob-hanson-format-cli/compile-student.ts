"use strict"

const { parseArgs } = require("node:util")
const fs = require("graceful-fs")
const yaml = require("js-yaml")
const { enhanceHanson } = require("@gob/hanson-format")

function compileStudent(args, data) {
  let obj = yaml.safeLoad(data)
  return enhanceHanson(obj)
}

module.exports = function cli() {
  const { positionals } = parseArgs({
    allowPositionals: true,
  })

  if (positionals.length === 0) {
    console.error("Error: filename is required")
    console.error("Usage: compile-student <filename>")
    process.exit(1)
  }

  const filename = positionals[0]
  let data = fs.readFileSync(filename, { encoding: "utf-8" })
  let student = compileStudent({ filename }, data)
  console.log(JSON.stringify(student, null, 2))
}
