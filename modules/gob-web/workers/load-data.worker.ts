import { loadFiles, loadTerm } from "@gob/worker-load-data"
import { IS_WORKER } from "./lib"

function checkIdbInWorkerSupport() {
  if (globalThis.IDBCursor) {
    return true
  }
  return false
}

function sendMessage(params: {
  id: string
  [key: string]: unknown
}): Promise<void> {
  let { id, type, ...args } = params
  let strMessage = JSON.stringify({ id, type, ...args })
  self.postMessage(strMessage)
}

async function main({ data }) {
  let message = JSON.parse(data)

  switch (message.type) {
    case "check-idb-in-worker-support": {
      let supportState = await checkIdbInWorkerSupport()
      await sendMessage({ id: message.id, supported: supportState })
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
      message.type as never
    }
  }

  sendMessage({ id: message.id })
}

if (IS_WORKER) {
  globalThis.addEventListener("message", main)
}

class PointlessExportForTestingAndFlow {
  addEventListener(_1: string, _2: (...args: Array<unknown>) => unknown) {}
  removeEventListener(_1: string, _2: (...args: Array<unknown>) => unknown) {}
  postMessage(_: string) {}
}

export default PointlessExportForTestingAndFlow
