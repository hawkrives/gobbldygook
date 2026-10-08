import { readFile } from "node:fs/promises"
import getStdin from "get-stdin"

// Reads JSON from the file at `path`, or from stdin when no path is given
export async function loadJson(path?: string): Promise<unknown> {
  let text =
    path === undefined ? await getStdin() : await readFile(path, "utf-8")
  return JSON.parse(text)
}
