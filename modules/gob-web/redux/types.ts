export type Undoable<T> = {
  p: t: Array<T>
  future: Array<T>
  present: T
}

export type Action<T> = {
  type: string
  payload: T
  error?: boolean
}
