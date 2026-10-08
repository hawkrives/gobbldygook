export type { Course, Offering } from "./course"

export type Result<T> =
  | { error: false; result: T; meta?: Record<string, unknown> }
  | { error: true; result: Error; meta?: Record<string, unknown> }
