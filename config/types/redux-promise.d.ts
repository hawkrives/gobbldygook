// redux-promise@0.6 ships no types, and @types/redux-promise wants redux 3.
declare module "redux-promise" {
  import type { Middleware } from "redux"

  // Dispatches the resolved value of a promise action, or of a flux
  // standard action whose payload is a promise
  const promiseMiddleware: Middleware
  export default promiseMiddleware
}
