import { combineReducers } from "redux"

import notifications from "../modules/notifications/redux/reducers.ts"
import { reducer as students } from "./students/reducers/index.ts"

const rootReducer = combineReducers({
  notifications,
  students,
})

export type RootState = Readonly<ReturnType<typeof rootReducer>>

export default rootReducer
