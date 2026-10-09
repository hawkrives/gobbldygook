import uniqueId from "lodash/uniqueId"
import { status, text } from "@gob/lib"
import type { AnyAction, Dispatch } from "redux"
import * as notificationActions from "../modules/notifications/redux/actions"
import LoadDataWorker from "./load-data.worker"
import mem from "mem"

declare global {
  // the app's store.dispatch, set by index.js so the worker can notify
  var _dispatch: Dispatch | undefined
}

const COURSE_URL = APP_BASE + "courseData.url"
const AREA_URL = APP_BASE + "areaData.url"

type WorkerActionCreator = (...args: ReadonlyArray<unknown>) => AnyAction

// The worker names an action creator and is trusted to send it matching
// arguments; see @gob/worker-load-data's lib-dispatch
const actions = {
  notifications: notificationActions,
} as unknown as Readonly<
  Record<string, Readonly<Record<string, WorkerActionCreator | undefined>>>
>

const worker = new LoadDataWorker()

let fetchText = (input: string) => fetch(input).then(status).then(text)

const memFetchText: typeof fetchText = mem(fetchText)

worker.addEventListener("error", (msg) => {
  console.warn("[main] received error from load-data worker:", msg)
})

worker.addEventListener("message", ({ data }: MessageEvent<string>) => {
  // the worker sends dispatch requests, and also the replies that
  // messageWorker listens for, which have no type
  const { type, message } = JSON.parse(data) as
    | DispatchMessage
    | { type?: undefined; message?: undefined }
  if (type === "dispatch") {
    const actionCreator = actions[message.type]?.[message.action]
    if (!actionCreator) {
      throw new Error(
        `load-data worker asked for unknown action ${message.type}.${message.action}`,
      )
    }
    const action = actionCreator(...message.args)
    globalThis._dispatch?.(action)
  }
})

export type DispatchMessage = Readonly<{
  type: "dispatch"
  message: Readonly<{
    type: string
    action: string
    args: ReadonlyArray<unknown>
  }>
}>

export type LoadDataMessageEnum =
  | Readonly<{ type: "load-from-info"; path: string; url: string }>
  | Readonly<{ type: "check-idb-in-worker-support" }>
  | Readonly<{
      type: "load-term-data"
      term: number
      courseInfoUrl: string
      path: string
    }>
  | DispatchMessage

export type LoadDataMessage = Readonly<{ id: string }> & LoadDataMessageEnum

function messageWorker(
  params: LoadDataMessageEnum,
): Promise<Record<string, unknown>> {
  let sourceId = uniqueId()

  return new Promise((resolve) => {
    // This is inside of the function so that it doesn't get unregistered too early
    function onMessage({ data }: MessageEvent<string>) {
      // the worker replies with the id of the message it is answering
      let { id: resultId, ...args } = JSON.parse(data) as {
        id?: string
      } & Record<string, unknown>

      if (resultId === sourceId) {
        worker.removeEventListener("message", onMessage)
        resolve(args)
      }
    }

    worker.addEventListener("message", onMessage)

    let message: LoadDataMessage = { id: sourceId, ...params }
    worker.postMessage(JSON.stringify(message))
  })
}

async function loadDataFile(url: string) {
  let nonce = Date.now()

  let path = await memFetchText(url).then((path) => path.trim())

  await messageWorker({
    type: "load-from-info",
    url: `${path}/info.json?${nonce}`,
    path: path,
  })
}

export async function loadDataForTerm(term: number): Promise<void> {
  let nonce = Date.now()

  if (!navigator.onLine) {
    return
  }

  let path = await memFetchText(COURSE_URL).then((path) => path.trim())

  await messageWorker({
    type: "load-term-data",
    term: term,
    courseInfoUrl: `${path}/info.json?${nonce}`,
    path: path,
  })
}

export default async function loadData() {
  const infoFiles = [COURSE_URL, AREA_URL]

  if (navigator.onLine) {
    await Promise.all(infoFiles.map(loadDataFile))
  } else {
    if (!globalThis._dispatch) {
      return
    }

    let action = notificationActions.logError({
      id: "offline",
      error: "You appear to be offline. No information was downloaded.",
    })
    globalThis._dispatch(action)
  }
}
