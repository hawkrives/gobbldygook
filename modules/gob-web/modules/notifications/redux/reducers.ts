import omit from "lodash/omit.js"

import {
  LOG_MESSAGE,
  LOG_ERROR,
  START_PROGRESS,
  INCREMENT_PROGRESS,
  REMOVE_NOTIFICATION,
} from "./constants.ts"
import type { AnyAction } from "redux"
import type { NotificationAction } from "./actions.ts"

// INCREMENT_PROGRESS updates its own copy of a progress notification, so
// this one stays writable
type ProgressNotification = {
  type: "progress"
  message: string
  value: number
  max: number
  showButton: boolean
}

export type NotificationState =
  | Readonly<{ type: "message"; message: string }>
  | Readonly<{ type: "error"; message: string }>
  | Readonly<ProgressNotification>

export type State = Readonly<Record<string, NotificationState>>

const initialState: State = {}

export default function reducer(
  state: State = initialState,
  anyAction: AnyAction,
): State {
  // every action reaches this reducer, but it only reads the payload of the
  // notification actions, which it narrows by type below
  let action = anyAction as NotificationAction
  switch (action.type) {
    case LOG_MESSAGE: {
      let { payload } = action
      return {
        ...state,
        [payload.id]: {
          message: payload.message,
          type: "message",
        },
      }
    }

    case LOG_ERROR: {
      let { payload } = action
      let { error } = payload
      return {
        ...state,
        [payload.id]: {
          // the offline notice logs a plain string
          message: typeof error === "string" ? error : error.message,
          type: "error",
        },
      }
    }

    case START_PROGRESS: {
      let { payload } = action
      return {
        ...state,
        [payload.id]: {
          message: payload.message,
          value: payload.value,
          max: payload.max,
          showButton: payload.showButton,
          type: "progress",
        },
      }
    }

    case INCREMENT_PROGRESS: {
      let { payload } = action
      let previous = state[payload.id]
      if (previous?.type !== "progress") {
        return state
      }

      // make a copy of the previous item
      const progress: ProgressNotification = { ...previous }
      progress.value += payload.by
      progress.value = Math.min(progress.value, progress.max)

      return { ...state, [payload.id]: progress }
    }

    case REMOVE_NOTIFICATION: {
      return omit(state, action.payload.id)
    }

    default: {
      return state
    }
  }
}
