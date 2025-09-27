#!/usr/bin/env node
/* eslint-disable no-global-assign */

require = require("esm")(module /*, options*/)

require("./module.js").default()
