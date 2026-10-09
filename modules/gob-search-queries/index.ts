// can't use export * with babel: see https://github.com/babel/babel/issues/4446
export { buildQueryFromString } from "./build-query-from-string.ts"
export { checkCourseAgainstQuery } from "./check-course-against-query.ts"
export { queryCourses } from "./query-courses.ts"
export type { Query, Queryable, QueryValue } from "./types.ts"
