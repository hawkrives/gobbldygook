// @flow
import db from './db'
import { enhanceHanson } from '../../hanson-format'
import some from 'lodash/some'
import maxBy from 'lodash/maxBy'
import find from 'lodash/find'
import kebabCase from 'lodash/kebabCase'
import yaml from 'js-yaml'
import debug from 'debug'
import pluralizeArea from '../../examine-student/pluralize-area'
import { status, text } from '../../lib/fetch-helpers'
const log = debug('worker:load-area')

function resolveArea(areas, query) {
    if (!('revision' in query)) {
        return maxBy(areas, 'revision')
    } else if (some(areas, possibility => 'dateAdded' in possibility)) {
        return maxBy(areas, 'dateAdded')
    } else {
        return maxBy(areas, possibility => possibility.sourcePath.length)
    }
}

function transform(areaSource) {
    return enhanceHanson(yaml.safeLoad(areaSource))
}

type AreaQueryType = {
    name: string,
    type: string,
    revision: string,
    source: string,
    isCustom: string,
};

const baseUrl = 'https://hawkrives.github.io/gobbldygook-area-data'
const networkCache = Object.create(null)
function loadAreaFromNetwork({ name, type, revision }: AreaQueryType) {
    const id = `{${name}, ${type}, ${revision}}`
    if (id in networkCache) {
        return networkCache[id]
    }

    const path = `${baseUrl}/${pluralizeArea(type)}/${kebabCase(name)}.yaml`

    networkCache[id] = fetch(path).then(status).then(text).then(transform)

    return networkCache[id].then(area => {
        return {
            name,
            type,
            revision,
            _area: area,
        }
    })
}

function loadAreaFromDatabase(areaQuery: AreaQueryType) {
    const { name, type, revision } = areaQuery

    let dbQuery: any = { name: [name], type: [type] }
    if (revision && revision !== 'latest') {
        dbQuery.revision = [revision]
    }

    return db
        .store('areas')
        .query(dbQuery)
        .then(result => {
            if (!result || !result.length) {
                return {
                    ...areaQuery,
                    _error: `the area "${name}" (${type}) could not be found with the query ${JSON.stringify(dbQuery)}`,
                }
            }

            if (result.length === 1) {
                result = result[0]
            } else {
                result = resolveArea(result, dbQuery)
            }

            return { ...areaQuery, _area: enhanceHanson(result) }
        })
        .catch(err => {
            log(err) // we can probably remove this in the future
            return {
                ...areaQuery,
                _error: `Could not find area ${JSON.stringify(dbQuery)} (error: ${err.message})`,
            }
        })
}

const promiseCache = Object.create(null)

export default function getArea(
    areaQuery: AreaQueryType,
    { cache = [] }: { cache: any[] }
) {
    const { name, type, revision, source, isCustom } = areaQuery
    let cachedArea = find(
        cache,
        a =>
            a.name === name &&
            a.type === type &&
            (revision === 'latest' ? true : a.revision === revision)
    )
    if (cachedArea) {
        log('loadArea used cached area')
        return cachedArea
    }

    if (isCustom && source) {
        return Promise.resolve({
            ...areaQuery,
            _area: transform(source),
        })
    }

    const id = `{${name}, ${type}, ${revision}}`
    if (id in promiseCache) {
        return promiseCache[id]
    }

    let getAreaFrom = loadAreaFromDatabase
    if (global.useNetworkOnly) {
        getAreaFrom = loadAreaFromNetwork
    }

    promiseCache[id] = getAreaFrom({ name, type, revision, source, isCustom })

    return promiseCache[id].then(area => {
        // console.log(area)
        delete promiseCache[id]
        return area
    })
}
