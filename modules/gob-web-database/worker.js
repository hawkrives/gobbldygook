// @flow

import { PGlite } from "@electric-sql/pglite"
import { worker } from "@electric-sql/pglite/worker"

// TODO: migrate data from indexeddb to pglite

worker({
  async init() {
    // Create and return a PGlite instance
    return new PGlite()
  },
})
