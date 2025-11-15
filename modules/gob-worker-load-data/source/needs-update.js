// @flow

import { cacheNeedsUpdate } from "@gob/web-database"
import type { InfoFileTypeEnum } from "./types"

export default function needsUpdate(
  type: InfoFileTypeEnum,
  path: string,
  hash: string,
) {
  return cacheNeedsUpdate(type, path, hash)
}
