// WorkerGlobalScope only exists inside a worker, and the DOM lib doesn't
// declare it
declare const WorkerGlobalScope: (abstract new () => object) | undefined

export const IS_WORKER =
  typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope

// The app imports each worker module with Vite's `?worker` suffix, which gives
// a constructor for the worker. Under Vitest, vitest.config.ts resolves those
// imports to the module itself, whose default export is this stand-in, which
// never answers.
class PointlessExportForTesting {
  addEventListener(_1: string, _2: unknown) {}
  removeEventListener(_1: string, _2: unknown) {}
  postMessage(_: string) {}
}

export const WorkerStandIn =
  PointlessExportForTesting as unknown as new () => Worker
