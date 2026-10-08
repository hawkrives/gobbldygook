// idb-request@3 ships no types.
declare module "idb-request" {
  // Resolves with the request's result, or, when `transaction` is given,
  // once that transaction completes.
  export function request<T = unknown>(
    req: IDBRequest,
    transaction?: IDBTransaction | null,
  ): Promise<T>
  export function requestTransaction(transaction: IDBTransaction): Promise<void>
  export function requestCursor(
    req: IDBRequest<IDBCursorWithValue | null>,
    iterator: (cursor: IDBCursorWithValue) => void,
  ): Promise<void>
}
