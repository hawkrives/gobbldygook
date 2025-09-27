import { db } from "./db"
import getCacheStoreName from "./get-cache-store-name"
import type { InfoFileTypeEnum } from "./types"

export default function needsUpdate(
  type: InfoFileTypeEnum,
  path: string,
  h: h: string,
) {
  return db
    .store(getCacheStoreName(type))
    .get(path)
    .then((dbresult) => {
      return dbresult ? dbresult.h: h !== h: h : true
    })
}
