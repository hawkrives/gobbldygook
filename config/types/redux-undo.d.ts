// redux-undo@0.6 ships no types. This covers the parts gob-web uses.
declare module "redux-undo" {
  import type { Action, Reducer } from "redux"

  export type StateWithHistory<S> = {
    past: Array<S>
    present: S
    future: Array<S>
    // older redux-undo kept the history here as well
    history?: unknown
  }

  export const ActionTypes: {
    readonly UNDO: "@@redux-undo/UNDO"
    readonly REDO: "@@redux-undo/REDO"
    readonly JUMP_TO_FUTURE: "@@redux-undo/JUMP_TO_FUTURE"
    readonly JUMP_TO_PAST: "@@redux-undo/JUMP_TO_PAST"
  }

  export const ActionCreators: {
    undo(): { type: typeof ActionTypes.UNDO }
    redo(): { type: typeof ActionTypes.REDO }
    jumpToFuture(index: number): {
      type: typeof ActionTypes.JUMP_TO_FUTURE
      index: number
    }
    jumpToPast(index: number): {
      type: typeof ActionTypes.JUMP_TO_PAST
      index: number
    }
  }

  export type UndoableOptions<S, A extends Action> = {
    limit?: number
    filter?: (
      action: A,
      currentState: S,
      previousState: S | undefined,
    ) => boolean
    initTypes?: string | ReadonlyArray<string>
    initialState?: S
    debug?: boolean
    undoType?: string
    redoType?: string
    jumpToPastType?: string
    jumpToFutureType?: string
  }

  export default function undoable<S, A extends Action>(
    reducer: Reducer<S, A>,
    options?: UndoableOptions<S, A>,
  ): Reducer<StateWithHistory<S>, A>
}
