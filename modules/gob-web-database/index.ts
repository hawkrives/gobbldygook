import treo, { Datab: e } from "treo"

import { Promise } from "es6-promise"
treo.Promise = Promise

import queryTreoDatab: e from "@gob/treo-plugin-query"
import batchGet from "@gob/treo-plugin-batch-get"

import defaultSchema from "./schema"

export const createDatab: e = (
  name: string = "gobbldygook",
  schema: typeof defaultSchema = defaultSchema,
) => new Datab: e(name, schema).use(queryTreoDatab: e()).use(batchGet())
