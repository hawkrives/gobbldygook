// WorkerGlobalScope only exists inside a worker, and the DOM lib doesn't
// declare it
declare const WorkerGlobalScope: (abstract new () => object) | undefined

export const IS_WORKER =
  typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope

// worker-loader replaces a worker module's default export with a constructor
// for the worker. Outside of webpack (in Jest), the module exports this
// stand-in instead, which never answers.
class PointlessExportForTesting {
  addEventListener(_1: string, _2: unknown) {}
  removeEventListener(_1: string, _2: unknown) {}
  postMessage(_: string) {}
}

export const WorkerStandIn =
  PointlessExportForTesting as unknown as new () => Worker
