import {
  INCREMENT_PROGRESS,
  LOG_ERROR,
  LOG_MESSAGE,
  REMOVE_NOTIFICATION,
  START_PROGRESS,
} from "../constants"
import reducer from "../reducers"
import type { State } from "../reducers"

describe("notifications reducer", () => {
  it("returns the initial state", () => {
    const expected = {}
    const actual = reducer(undefined, { type: "@@INIT" })
    expect(actual).toEqual(expected)
  })

  it("handles LOG_MESSAGE", () => {
    const message = "message"

    const actualState = reducer(undefined, {
      type: LOG_MESSAGE,
      payload: { id: "0", message },
    })
    const expectedState = { "0": { message, type: "message" } }

    expect(actualState).toEqual(expectedState)
  })

  it("handles LOG_ERROR", () => {
    const error = new Error("message")

    const actualState = reducer(undefined, {
      type: LOG_ERROR,
      payload: { id: "0", error, args: [] },
    })
    const expectedState = { "0": { message: error.message, type: "error" } }

    expect(actualState).toEqual(expectedState)
  })

  it("handles REMOVE_NOTIFICATION", () => {
    const id = "0"
    const message = "message"

    const action = { type: REMOVE_NOTIFICATION, payload: { id, message } }

    const initialState: State = { [id]: { message, type: "message" } }
    const expectedState = {}
    const actualState = reducer(initialState, action)

    expect(actualState).toEqual(expectedState)
  })

  it("handles START_PROGRESS", () => {
    const id = "0"
    const message = "message"
    const value = 0
    const max = 1
    const showButton = false

    const actualState = reducer(undefined, {
      type: START_PROGRESS,
      payload: { id, message, value, max, showButton },
    })
    const expectedState = {
      [id]: { message, value, max, showButton, type: "progress" },
    }

    expect(actualState).toEqual(expectedState)
  })

  it("handles INCREMENT_PROGRESS", () => {
    const id = "0"
    const message = "message"
    const value = 0
    const max = 1
    const by = 1
    const showButton = false

    const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

    const initialState: State = {
      [id]: { message, value, max, showButton, type: "progress" },
    }
    const expectedState = {
      [id]: {
        message,
        value: value + by,
        max,
        showButton,
        type: "progress",
      },
    }
    const actualState = reducer(initialState, action)

    expect(actualState).toEqual(expectedState)
  })

  it('does not let INCREMENT_PROGRESS go past "max"', () => {
    const id = "0"
    const message = "message"
    const value = 0
    const max = 1
    const by = 5
    const showButton = false

    const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

    const initialState: State = {
      [id]: { message, value, max, showButton, type: "progress" },
    }
    const expectedState = {
      [id]: { message, value: 1, max, showButton, type: "progress" },
    }
    const actualState = reducer(initialState, action)

    expect(actualState).toEqual(expectedState)
  })

  it("allows custom values for INCREMENT_PROGRESS", () => {
    const id = "0"
    const message = "message"
    const value = 5
    const max = 10
    const by = 5
    const showButton = false

    const action = { type: INCREMENT_PROGRESS, payload: { id, by } }

    const initialState: State = {
      [id]: { message, value, max, showButton, type: "progress" },
    }
    const expectedState = {
      [id]: {
        message,
        value: value + by,
        max,
        showButton,
        type: "progress",
      },
    }
    const actualState = reducer(initialState, action)

    expect(actualState).toEqual(expectedState)
  })

  it("does not mutate the progress item during INCREMENT_PROGRESS", () => {
    const id = "0"
    const notification = {
      type: "progress" as const,
      message: "",
      value: 0,
      max: 1,
      showButton: true,
    }

    const action = { type: INCREMENT_PROGRESS, payload: { id, by: 1 } }

    const initialState: State = { [id]: notification }
    const actualState = reducer(initialState, action)

    expect(initialState[id]).not.toBe(actualState[id])
  })
})
