import { db } from "./db.ts"
import getCacheStoreName from "./get-cache-store-name.ts"
import type { CachedFile, InfoFileTypeEnum } from "./types.ts"

export default function cacheItemHash(
  path: string,
  type: InfoFileTypeEnum,
  hash: string,
): Promise<IDBValidKey> {
  console.log(`caching ${path}`)
  const item: CachedFile = { id: path, path, hash }
  return db.store(getCacheStoreName(type)).put(item)
}
