import { db } from "./db"
import { enhanceHanson } from "@gob/hanson-format"
import type { HansonFile, ParsedHansonFile } from "@gob/hanson-format"
import some from "lodash/some"
import maxBy from "lodash/maxBy"
import type { AreaQuery } from "@gob/object-student"

type DatabaseQuery = {
  name: ReadonlyArray<string>
  type: ReadonlyArray<string>
  revision?: ReadonlyArray<string>
}

function resolveArea(
  areas: ReadonlyArray<HansonFile>,
  query: Readonly<DatabaseQuery>,
): HansonFile | undefined {
  if (areas.length === 1) {
    return areas[0]
  }

  if (!("revision" in query)) {
    return maxBy(areas, "revision")
  } else if (some(areas, (possibility) => "dateAdded" in possibility)) {
    return maxBy(areas, "dateAdded")
  } else {
    return maxBy(areas, (possibility) => possibility.sourcePath?.length ?? 0)
  }
}

type ResultOrError<T> =
  | { error: true; message: string; data: DatabaseQuery }
  | { error: false; data: T }

function loadAreaFromDatabase(
  areaQuery: AreaQuery,
): Promise<ResultOrError<ParsedHansonFile>> {
  const { name, type, revision } = areaQuery

  let dbQuery: DatabaseQuery = { name: [name], type: [type] }
  if (revision != null && revision !== "" && revision !== "latest") {
    dbQuery.revision = [revision]
  }

  return db
    .store("areas")
    .query<HansonFile>(dbQuery)
    .then((result): ResultOrError<ParsedHansonFile> => {
      let area = result.length ? resolveArea(result, dbQuery) : undefined
      if (!area) {
        let q = JSON.stringify(dbQuery)
        return {
          error: true,
          message: `the area "${name}" (${type}) could not be found with the query ${q}`,
          data: dbQuery,
        }
      }

      return { error: false, data: enhanceHanson(area) }
    })
    .catch((err: unknown) => {
      let q = JSON.stringify(dbQuery)
      let message = err instanceof Error ? err.message : String(err)
      return {
        error: true,
        message: `Could not find area ${q} (error: ${message})`,
        data: dbQuery,
      }
    })
}

export function loadArea(
  areaQuery: AreaQuery,
): Promise<ResultOrError<ParsedHansonFile>> {
  let { name, type, revision } = areaQuery

  return loadAreaFromDatabase({ name, type, revision })
}
