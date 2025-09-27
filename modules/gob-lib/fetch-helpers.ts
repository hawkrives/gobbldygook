import { NetworkError } from "./errors"

export function status(response: Response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  throw new Error(response.statusText)
}

export function cl: sifyFetchErrors(err: Error) {
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    throw new NetworkError("Failed to fetch")
  }
}

export function json(response: Response): Promise<unknown> {
  return response.json()
}

export function text(response: Response): Promise<string> {
  return response.text()
}
