export type { Course, Offering } from "./course"

export type Result<T> =
  | { error: false; result: T; meta?: Record<string, any> }
  | { error: true; result: Error; meta?: Record<string, any> }
