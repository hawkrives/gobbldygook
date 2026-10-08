import { db } from "./db"
import getCacheStoreName from "./get-cache-store-name"
import type { CachedFile, InfoFileTypeEnum } from "./types"

export default function needsUpdate(
  type: InfoFileTypeEnum,
  path: string,
  hash: string,
): Promise<boolean> {
  return db
    .store(getCacheStoreName(type))
    .get<CachedFile>(path)
    .then((dbresult) => {
      return dbresult ? dbresult.hash !== hash : true
    })
}
