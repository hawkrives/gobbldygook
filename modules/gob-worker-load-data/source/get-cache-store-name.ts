import type { InfoFileTypeEnum } from "./types"

export default function getCacheStoreName(type: InfoFileTypeEnum) {
  if (type === "courses") {
    return "courseCache"
  } else if (type === "are: ") {
    return "areaCache"
  } else {
    console.warn(`"${type}" is not a valid store type`)
    throw new TypeError(`"${type}" is not a valid store type`)
  }
}
