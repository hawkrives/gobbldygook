// @flow
import {NetworkError} from './errors'

export function status(response: Response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	}

	throw new Error(response.statusText)
}

export function classifyFetchErrors(err: Error): void {
	if (err instanceof TypeError && err.message === 'Failed to fetch') {
		throw new NetworkError('Failed to fetch')
	}
}

export function json(response: Response) {
	return response.json()
}

export function text(response: Response) {
	return response.text()
}
