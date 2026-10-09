import delay from "delay"

import {
  LOG_MESSAGE,
  LOG_ERROR,
  START_PROGRESS,
  INCREMENT_PROGRESS,
  REMOVE_NOTIFICATION,
} from "./constants.ts"

type RemovePayload = Readonly<{ id: string }>

export type RemoveNotificationAction = Readonly<{
  type: typeof REMOVE_NOTIFICATION
  payload: RemovePayload
}>

export type LogMessageAction = Readonly<{
  type: typeof LOG_MESSAGE
  payload: Readonly<{ id: string; message: string }>
}>

export type LogErrorAction = Readonly<{
  type: typeof LOG_ERROR
  payload: Readonly<{
    id: string
    error: Error | string
    args: ReadonlyArray<unknown>
  }>
}>

export type StartProgressAction = Readonly<{
  type: typeof START_PROGRESS
  payload: Readonly<{
    id: string
    message: string
    value: number
    max: number
    showButton: boolean
  }>
}>

export type IncrementProgressAction = Readonly<{
  type: typeof INCREMENT_PROGRESS
  payload: Readonly<{ id: string; by: number }>
}>

export type NotificationAction =
  | RemoveNotificationAction
  | LogMessageAction
  | LogErrorAction
  | StartProgressAction
  | IncrementProgressAction

export function removeNotification(id: string): RemoveNotificationAction
// with a delay, redux-promise dispatches the action once the payload resolves
export function removeNotification(
  id: string,
  delayBy: number,
):
  | RemoveNotificationAction
  | {
      type: typeof REMOVE_NOTIFICATION
      payload: Promise<RemovePayload>
    }
export function removeNotification(id: string, delayBy: number = 0) {
  if (delayBy) {
    return {
      type: REMOVE_NOTIFICATION,
      payload: delay(delayBy).then(() => ({ id })),
    }
  }
  return { type: REMOVE_NOTIFICATION, payload: { id } }
}

export function logMessage(id: string, message: string): LogMessageAction {
  return { type: LOG_MESSAGE, payload: { id, message } }
}

export function logError(
  { id, error }: Readonly<{ id: string; error: Error | string }>,
  ...args: ReadonlyArray<unknown>
): LogErrorAction {
  if (!globalThis.TESTING) console.error(error, ...args)
  return { type: LOG_ERROR, payload: { id, error, args } }
}

export function startProgress(
  id: string,
  message: string = "",
  {
    value = 0,
    max = 1,
    showButton = false,
  }: Readonly<{ value?: number; max?: number; showButton?: boolean }> = {},
): StartProgressAction {
  return {
    type: START_PROGRESS,
    payload: { id, message, value, max, showButton },
  }
}

export function incrementProgress(
  id: string,
  by: number = 1,
): IncrementProgressAction {
  return { type: INCREMENT_PROGRESS, payload: { id, by } }
}
