import type { CourseType } from "../types.ts"

// The checks under test only read a few fields (year, semester, clbid,
// offerings), so test courses only set those. Some tests rely on a field
// being missing, which is why this doesn't fill in defaults.
export function course(fields: Partial<CourseType>): CourseType {
  return fields as CourseType
}
