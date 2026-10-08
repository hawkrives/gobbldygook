import { combineReducers } from "redux"

import notifications from "../modules/notifications/redux/reducers"
import { reducer as students } from "./students/reducers"

const rootReducer = combineReducers({
  notifications,
  students,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
