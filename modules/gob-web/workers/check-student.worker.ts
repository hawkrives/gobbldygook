import prettyMs from "pretty-ms"
import present from "present"
import { checkAgainstArea } from "@gob/worker-check-student"
import type { ParsedHansonFile } from "@gob/hanson-format"
import type { CourseType } from "@gob/object-student"
import type { FulfillmentsObject, OverridesObject } from "@gob/examine-student"
import { IS_WORKER, WorkerStandIn } from "./lib"

// what workers/check-student sends
type CheckMessage = {
  id: string
  area: ParsedHansonFile
  courses: Array<CourseType>
  fulfillments: FulfillmentsObject
  overrides: OverridesObject
  name: string
}

function main({ data }: MessageEvent<string>) {
  const start = present()

  // why stringify? https://code.google.com/p/chromium/issues/detail?id=536620#c11
  // > We know that serialization/deserialization is slow. It's actually faster to
  // > JSON.stringify() then postMessage() a string than to postMessage() an object. :(

  const { id, area, courses, fulfillments, overrides, name } = JSON.parse(
    data,
  ) as CheckMessage
  // console.log('received message:', id, student, area)

  try {
    let result = checkAgainstArea(area, { courses, fulfillments, overrides })
    self.postMessage(JSON.stringify({ id, type: "result", data: result }))
    const taken = prettyMs(present() - start)
    console.log(`(${name}, ${String(area.name)}) took ${taken}`)
  } catch (error) {
    let message = error instanceof Error ? error.message : String(error)
    self.postMessage(JSON.stringify({ id, type: "error", data: { message } }))
    // the names go in as arguments, not in the format string, so a "%" in a
    // student's name can't change what gets logged
    console.warn("(%s, %s)", name, String(area.name), error)
  }
}

if (IS_WORKER) {
  self.addEventListener("message", main)
}

export default WorkerStandIn
