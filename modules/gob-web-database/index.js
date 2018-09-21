// @flow

import treo, {Database} from 'treo'

import Promise from 'es6-promise'
treo.Promise = Promise

import queryTreoDatabase from '@gob/treo-plugin-query'
import batchGet from '@gob/treo-plugin-batch-get'

import defaultSchema from './schema'

export const createDatabase = (
	name: string = 'gobbldygook',
	schema: typeof defaultSchema = defaultSchema,
) => new Database(name, schema).use(queryTreoDatabase()).use(batchGet())
