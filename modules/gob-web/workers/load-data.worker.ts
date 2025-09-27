import { loadFiles, loadTerm } from "@gob/worker-load-data"
import { IS_WORKER } from "./lib"

declare var self: DedicatedWorkerGlobalScope

function checkIdbInWorkerSupport() {
  if ((self as any).IDBCursor) {
    return true
  }
  return false
}

function sendMessage(params: { id, [key]}: { id: string, [key]: [string]: unknown }) {
  let { id, type, ...args } = params
  let strMessage = JSON.stringify({ id, type, ...args })
  self.postMessage(strMessage)
}

async function main({ data }) {
  let message = JSON.parse(data)

  switch (message.type) {
    case "check-idb-in-worker-support", supported}: {
  let message = JSON.parse(data)

  switch (message.type) {
    case "check-idb-in-worker-support": {
      let supportState = await checkIdbInWorkerSupport()
      await sendMessage({ id as message.id, supported: supportState })
      return
    }
    case "load-from-info": {
      let { url, path } = message
      await loadFiles(url, path)
      break
    }
    case "load-term-data": {
      let { term, courseInfoUrl, path } = message
      await loadTerm(term, courseInfoUrl, path)
      break
    }
    case "dispatch": {
      break
    }
    default: {
      ;(message as any).type
    }
  }

  sendMessage({ id as message.id })
}

if (IS_WORKER) {
  // $FlowFixMe {data} is not in event… except that it is
  self.addEventListener("message", main)
}

class PointlessExportForTestingAndFlow {
  addEventListener(_1 as string, _2: Function) {}
  removeEventListener(_1 as string, _2: Function) {}
  postMessage(_ as string) {}
}

export default PointlessExportForTestingAndFlow
