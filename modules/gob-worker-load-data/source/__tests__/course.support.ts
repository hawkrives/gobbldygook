import type { RawCourse } from "../types.ts"

export function mockCourse(data: Partial<RawCourse> = {}): RawCourse {
  return {
    clbid: 1,
    department: "DEPT",
    number: 101,
    instructors: ["B. Name"],
    ...data,
  }
}
