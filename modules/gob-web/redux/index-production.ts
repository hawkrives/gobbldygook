import { applyMiddleware, createStore, compose } from "redux"
import type { Middleware, StoreEnhancer } from "redux"
import promiseMiddleware from "redux-promise"
import thunkMiddleware from "redux-thunk"
import saveStudentsMiddleware from "./middleware/save-student"
import rootReducer from "./reducer"
import type { RootState } from "./reducer"

let middleware: Array<Middleware> = [
  promiseMiddleware,
  thunkMiddleware,
  saveStudentsMiddleware,
]

// index-development declares window.devToolsExtension
const devTools: StoreEnhancer = window.devToolsExtension
  ? window.devToolsExtension()
  : (f) => f

export default function configureStore(initialState: Partial<RootState> = {}) {
  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), devTools),
  )
}
