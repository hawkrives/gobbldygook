"use strict"

// Lets the command-line tools load the workspace's source directly: Flow
// (.js) and TypeScript (.ts/.tsx) files are compiled on the fly with the
// repo's Babel config, targeting the running Node.

const path = require("path")

const root = path.resolve(__dirname, "..", "..", "..")

require("@babel/register")({
  cwd: root,
  envName: "node",
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  only: [path.join(root, "modules")],
  ignore: [/node_modules/, /parse-hanson-string\.js$/],
})
