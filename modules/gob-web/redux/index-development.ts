import { applyMiddleware, legacy_createStore, compose } from "redux"
import type { Middleware, StoreEnhancer } from "redux"
import promiseMiddleware from "redux-promise"
import thunkMiddleware from "redux-thunk"
import saveStudentsMiddleware from "./middleware/save-student"
import { createLogger as loggingMiddleware } from "redux-logger"
import rootReducer from "./reducer"
import type { RootState } from "./reducer"

declare global {
  interface Window {
    // the long-deprecated Redux DevTools hook
    devToolsExtension?: () => StoreEnhancer
  }
}

let middleware: Array<Middleware> = [
  promiseMiddleware,
  thunkMiddleware,
  saveStudentsMiddleware,
]

if (!globalThis.TESTING) {
  middleware.push(loggingMiddleware({ duration: true, collapsed: true }))
}

const devTools: StoreEnhancer = window.devToolsExtension
  ? window.devToolsExtension()
  : (f) => f

export default function configureStore(initialState: Partial<RootState> = {}) {
  // configureStore from Redux Toolkit sets up its own middleware, which would
  // change the store's behavior, so this keeps the plain Redux store
  return legacy_createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), devTools),
  )
}
