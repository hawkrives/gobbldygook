import { ActionTypes } from "redux-undo"
import { undo, redo } from "../undo.ts"
import { reducer } from "../../reducers/index.ts"
import { INIT_STUDENT } from "../../constants.ts"
import { CHANGE_STUDENT } from "../change.ts"

describe("undo", () => {
  it("creates an UNDO action for the given student", () => {
    expect(undo("xyz")).toEqual({
      type: ActionTypes.UNDO,
      payload: { id: "xyz" },
    })
  })

  it("only undoes changes to the given student", () => {
    let state = reducer(
      {},
      { type: INIT_STUDENT, payload: { id: "xyz", name: "first" } },
    )
    state = reducer(state, {
      type: INIT_STUDENT,
      payload: { id: "abc", name: "first" },
    })
    state = reducer(state, {
      type: CHANGE_STUDENT,
      payload: { id: "xyz", name: "second" },
    })
    state = reducer(state, {
      type: CHANGE_STUDENT,
      payload: { id: "abc", name: "second" },
    })

    let actual = reducer(state, undo("xyz"))

    expect(actual["xyz"]?.present).toEqual({ id: "xyz", name: "first" })
    expect(actual["abc"]?.present).toEqual({ id: "abc", name: "second" })
  })
})

describe("redo", () => {
  it("creates a REDO action for the given student", () => {
    expect(redo("xyz")).toEqual({
      type: ActionTypes.REDO,
      payload: { id: "xyz" },
    })
  })

  it("re-applies an undone change to the given student", () => {
    let state = reducer(
      {},
      { type: INIT_STUDENT, payload: { id: "xyz", name: "first" } },
    )
    state = reducer(state, {
      type: CHANGE_STUDENT,
      payload: { id: "xyz", name: "second" },
    })
    state = reducer(state, undo("xyz"))

    let actual = reducer(state, redo("xyz"))

    expect(actual["xyz"]?.present).toEqual({ id: "xyz", name: "second" })
  })
})
