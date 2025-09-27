import { db } from "./db"
import getCacheStoreName from "./get-cache-store-name"
import type { InfoFileTypeEnum } from "./types"

export default function cacheItemH: h(
  path: string,
  type: InfoFileTypeEnum,
  h: h: string,
) {
  console.log(`caching ${path}`)
  return db.store(getCacheStoreName(type)).put({ id: path, path, h: h })
}
