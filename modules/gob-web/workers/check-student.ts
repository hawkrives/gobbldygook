import uniqueId from "lodash/uniqueId"
import CheckStudentWorker from "./check-student.worker"
import type { ParsedHansonFile } from "@gob/hanson-format"
import type { EvaluationResult } from "@gob/examine-student"
import { Student } from "@gob/object-student"
import { getCourse } from "../helpers/get-courses"
import mem from "mem"
import QuickLRU from "quick-lru"

// What the worker sends back: the evaluated area, or a stringified error
type WorkerReply =
  | { id: string; type: "result"; data: EvaluationResult }
  | { id: string; type: "error"; data: { message: string } }

const worker = new CheckStudentWorker()

worker.addEventListener("error", function (event: Event) {
  console.warn("received error from check-student worker:", event)
})

// Checks a student object against an area of study.
async function checkStudentAgainstArea(
  student: Student,
  area: ParsedHansonFile,
): Promise<EvaluationResult> {
  return new Promise((resolve) => {
    const sourceId = uniqueId()
    function onMessage({ data: messageData }: MessageEvent<string>) {
      // the worker only sends messages that it built itself
      const reply = JSON.parse(messageData) as WorkerReply
      if (reply.id === sourceId) {
        worker.removeEventListener("message", onMessage)
        switch (reply.type) {
          case "result": {
            resolve(reply.data)
            break
          }
          case "error": {
            resolve({
              $type: "requirement",
              computed: false,
              error: reply.data.message,
              progress: { at: 0, of: 1 },
            })
            break
          }
          default: {
            reply satisfies never
          }
        }
      }
    }
    worker.addEventListener("message", onMessage)
    void student.activeCourses(getCourse).then((courses) => {
      let { fulfillments, overrides, name } = student
      let msg = JSON.stringify({
        id: sourceId,
        area,
        courses,
        fulfillments,
        overrides,
        name,
      })
      worker.postMessage(msg)
    })
  })
}

const memoized: typeof checkStudentAgainstArea = mem(checkStudentAgainstArea, {
  cache: new QuickLRU({ maxSize: 8 }),
  // Key on the whole student, not just its id, so that edits to the plan
  // get re-checked instead of returning the cached result.
  cacheKey: ([student, area]) => JSON.stringify([student, area]),
  maxAge: 60000,
})

export { memoized as checkStudentAgainstArea }
