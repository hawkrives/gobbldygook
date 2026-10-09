export type Undoable<T> = Readonly<{
  past: ReadonlyArray<T>
  future: ReadonlyArray<T>
  present: T
}>

export type Action<T> = {
  type: string
  payload: T
  error?: boolean
}
