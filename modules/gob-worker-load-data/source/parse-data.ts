import yaml from "js-yaml"
import type { InfoFileTypeEnum } from "./types"

// Course files are JSON lists of courses; area files are YAML, and keep
// their source text. Anything that fails to parse becomes {}.
export default function parseData(
  raw: string,
  type: InfoFileTypeEnum,
): unknown {
  try {
    if (type === "courses") {
      return JSON.parse(raw)
    } else if (type === "areas") {
      let data = yaml.safeLoad(raw) as Record<string, unknown>
      data["source"] = raw
      return data
    }
  } catch {
    // ignoring the error
  }
  return {}
}
