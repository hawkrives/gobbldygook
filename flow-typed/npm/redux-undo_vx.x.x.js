// flow-typed signature: 04c7566abc4a08aa8d32e7ac6ebeeae2
// flow-typed version: <<STUB>>/redux-undo_v^0.6.1/flow_v0.81.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'redux-undo'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'redux-undo' {
  declare module.exports: any;
  /*
  declare type UndoableState<T> = {
    present: T,
    past: Array<T>,
    future: Array<T>,
  }

  declare type Action<T> = {
    type: string,
    payload: T,
    error?: boolean,
  }

  declare type State<T> = T

  declare type UndoableOptions<T, U> = {
    limit?: false | number,
    filter?: (action: Action<U>, currentState: State<T>, previousState: State<T>) => boolean,
    undoType?: string,
    redoType?: string,
    jumpToPastType?: string,
    jumpToFutureType?: string,
    initialState?: ?T,
    initTypes?: Array<string>,
    initialHistory?: UndoableState<T>,
    debug?: boolean,
  }

  declare type Reducer<T, U> = (state: State<T>, action: Action<U>) => State<T>

  declare type UndoableReducer<T, U> = Reducer<UndoableState<T>, U>

  declare export default function undoable<T, U: *>(
    reducer: Reducer<T, U>,
    options?: UndoableOptions<T, U>,
  ): UndoableReducer<T, U>;

  declare export var ActionTypes: {
    UNDO: string,
    REDO: string,
    JUMP_TO_FUTURE: string,
    JUMP_TO_PAST: string,
  }
  */
}
