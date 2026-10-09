import { applyMiddleware, legacy_createStore, compose } from "redux"
import type { Middleware, StoreEnhancer } from "redux"
import promiseMiddleware from "redux-promise"
import thunkMiddleware from "redux-thunk"
import saveStudentsMiddleware from "./middleware/save-student.ts"
import rootReducer from "./reducer.ts"
import type { RootState } from "./reducer.ts"

let middleware: Array<Middleware> = [
  promiseMiddleware,
  thunkMiddleware,
  saveStudentsMiddleware,
]

// index-development declares window.devToolsExtension
const devTools: StoreEnhancer = window.devToolsExtension
  ? window.devToolsExtension()
  : (f) => f

export default function configureStore(
  initialState: Readonly<Partial<RootState>> = {},
) {
  // configureStore from Redux Toolkit sets up its own middleware, which would
  // change the store's behavior, so this keeps the plain Redux store
  return legacy_createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), devTools),
  )
}
