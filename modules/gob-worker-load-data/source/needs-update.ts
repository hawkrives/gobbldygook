import { db } from "./db.ts"
import getCacheStoreName from "./get-cache-store-name.ts"
import type { CachedFile, InfoFileTypeEnum } from "./types.ts"

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
