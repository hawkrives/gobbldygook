import treo, { Database } from "treo"

import { Promise as ES6Promise } from "es6-promise"
treo.Promise = ES6Promise

import queryTreoDatabase from "@gob/treo-plugin-query"
import batchGet from "@gob/treo-plugin-batch-get"

import defaultSchema from "./schema.ts"

export const createDatabase = (
  name: string = "gobbldygook",
  schema: typeof defaultSchema = defaultSchema,
): Database =>
  new Database(name, schema).use(queryTreoDatabase()).use(batchGet())
