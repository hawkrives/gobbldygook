export default function getCacheStoreName(
  // `type` comes from the info index file, so it is checked at runtime
  type: string,
): "courseCache" | "areaCache" {
  if (type === "courses") {
    return "courseCache"
  } else if (type === "areas") {
    return "areaCache"
  } else {
    console.warn(`"${type}" is not a valid store type`)
    throw new TypeError(`"${type}" is not a valid store type`)
  }
}
