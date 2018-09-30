// @flow

import {createDatabase} from '@gob/web-database'

export const db = createDatabase()

global._db = db
