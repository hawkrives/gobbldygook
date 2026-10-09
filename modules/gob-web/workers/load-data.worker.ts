import { loadFiles, loadTerm } from "@gob/worker-load-data"
import type { LoadDataMessage } from "./load-data"
import { IS_WORKER, WorkerStandIn } from "./lib"

function checkIdbInWorkerSupport() {
  if ("IDBCursor" in self) {
    return true
  }
  return false
}

function sendMessage(params: Readonly<{ id: string; [key: string]: unknown }>) {
  let { id, type, ...args } = params
  let strMessage = JSON.stringify({ id, type, ...args })
  self.postMessage(strMessage)
}

async function main({ data }: MessageEvent<string>) {
  // workers/load-data only sends LoadDataMessages
  let message = JSON.parse(data) as LoadDataMessage

  switch (message.type) {
    case "check-idb-in-worker-support": {
      let supportState = checkIdbInWorkerSupport()
      sendMessage({ id: message.id, supported: supportState })
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
      message satisfies never
    }
  }

  sendMessage({ id: message.id })
}

if (IS_WORKER) {
  self.addEventListener("message", (event: MessageEvent<string>) => {
    void main(event)
  })
}

export default WorkerStandIn
