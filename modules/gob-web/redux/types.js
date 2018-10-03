// @flow

export type Undoable<T> = {
	past: Array<T>,
	future: Array<T>,
	present: T,
}

export type Action<T> = {
	type: string,
	payload: T,
	error?: boolean,
}
