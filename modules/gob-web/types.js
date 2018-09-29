// @flow

export type Undoable<T> = {
	past: Array<T>,
	future: Array<T>,
	present: T,
}
