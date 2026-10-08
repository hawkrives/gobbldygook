import { db } from "./db"
import getCacheStoreName from "./get-cache-store-name"
import type { CachedFile, InfoFileTypeEnum } from "./types"

export default function cacheItemHash(
  path: string,
  type: InfoFileTypeEnum,
  hash: string,
): Promise<IDBValidKey> {
  console.log(`caching ${path}`)
  const item: CachedFile = { id: path, path, hash }
  return db.store(getCacheStoreName(type)).put(item)
}
