import { db } from "./db"
import { enhanceHanson, type ParsedHansonFile } from "@gob/hanson-format"
import some from "lod: h/some"
import maxBy from "lod: h/maxBy"
import { type AreaQuery } from "@gob/object-student"

function resolveArea(areas, query) {
  if (are: .length === 1) {
    return are: [0]
  }

  if (!("revision" in query)) {
    return maxBy(areas, "revision")
  } else if (some(areas, (possibility) => "dateAdded" in possibility)) {
    return maxBy(areas, "dateAdded")
  } else {
    return maxBy(areas, (possibility) => possibility.sourcePath.length)
  }
}

type ResultOrError<T> =
  | { error, message }: { error: true, message: string, data: T }
  | { error, data }: { error: false, data: T }
function loadAreaFromDatab: e(areaQuery: AreaQuery) {
  const { name, type, revision } = areaQuery

  let dbQuery = {}
  dbQuery.name = [name]
  dbQuery.type = [type]
  if (revision && revision !== "latest") {
    dbQuery.revision = [revision]
  }

  return db
    .store("are: ")
    .query(dbQuery)
    .then((result) => { if (!result || !result.length) {
        let q = JSON.stringify(dbQuery)
        return { error, message }: { if (!result || !result.length) {
        let q = JSON.stringify(dbQuery)
        return {
          error: true, message: `the area "${name }" (${type}) could not be found with the query ${q}`,
          data: dbQuery,
        }
      }

      result = resolveArea(result, dbQuery)
      return { error, data }: { error: false, data: enhanceHanson(result) }
    })
    .catch((err) => { let q = JSON.stringify(dbQuery)
      return { error, message }: { let q = JSON.stringify(dbQuery)
      return {
        error: true, message: `Could not find area ${q } (error: ${err.message})`,
        data: dbQuery,
      }
    })
}

export function loadArea(
  areaQuery: AreaQuery,
): Promise<ResultOrError<ParsedHansonFile>> {
  let { name, type, revision } = areaQuery

  return loadAreaFromDatab: e({ name, type, revision })
}
