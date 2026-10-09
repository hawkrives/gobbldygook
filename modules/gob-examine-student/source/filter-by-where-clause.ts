import forEach from "lodash/forEach.js"
import max from "lodash/max.js"
import min from "lodash/min.js"
import take from "lodash/take.js"
import uniqBy from "lodash/uniqBy.js"
import assertKeys from "./assert-keys.ts"
import compareCourseToQualification from "./compare-course-to-qualification.ts"
import simplifyCourse from "./simplify-course.ts"
import type {
  Course,
  Qualifier,
  Qualification,
  Counter,
  QualificationFunctionValue,
  QualificationStaticValue,
} from "./types.ts"

type FilterOptions = Readonly<{
  distinct?: boolean | undefined
  fullList?: ReadonlyArray<Course> | undefined
  counter?: Readonly<Counter> | undefined
}>

// Returns either baseList itself or a new list of courses.
export default function filterByWhereClause<L extends ReadonlyArray<Course>>(
  baseList: L,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- filterByQualification writes $computed-value onto the clause's function values
  clause: Qualifier,
  { distinct, fullList, counter }: FilterOptions = {},
): L | Course[] {
  // When filtering by an and-clause, we need access to both the
  // entire list of courses, and the result of the prior iteration.
  // To simplify future invocations, we default to `fullList = list`
  fullList ??= baseList

  // There are only two types of where-clauses: boolean, and qualification.
  // Boolean where-clauses are comprised of a set of qualifications.
  // This function always reduces down to a call to filterByQualification
  switch (clause.$type) {
    case "qualification":
      return filterByQualification(baseList, clause, {
        distinct,
        fullList,
        counter,
      })
    case "boolean":
      // either an and- or or-clause.
      switch (clause.$booleanType) {
        case "and": {
          // and-clauses become the result of applying each invocation to the
          // result of the prior one. they are the list of unique courses which
          // meet all of the qualifications.
          let filtered: L | Course[] = baseList
          forEach(clause.$and, (q) => {
            filtered = filterByWhereClause(filtered, q, {
              distinct,
              fullList,
              counter,
            })
          })
          return filtered
        }
        case "or": {
          // or-clauses are the list of unique courses that meet one or more
          // of the qualifications.
          let filtrations: Course[] = []
          forEach(clause.$or, (q) => {
            filtrations = filtrations.concat(
              filterByWhereClause(baseList, q, {
                distinct,
                counter,
              }),
            )
          })
          // uniquify the list of possibilities by way of turning them into
          // the simplified representations.
          return uniqBy(filtrations, simplifyCourse)
        }
        default:
          // only 'and' and 'or' are currently supported.
          throw new TypeError(
            `filterByWhereClause: neither $or nor $and were present in ${JSON.stringify(clause)}`,
          )
      }
    default: {
      // where-clauses *must* be either a 'boolean' or a 'qualification'
      const unexpected: { $type?: unknown } = clause
      throw new TypeError(
        `filterByWhereClause: wth kind of type is a "${String(unexpected.$type)}" clause?`,
      )
    }
  }
}
type QualificationFunction = (
  items: ReadonlyArray<QualificationStaticValue>,
) => QualificationStaticValue | undefined

const qualificationFunctionLookup: Readonly<
  Record<string, QualificationFunction>
> = {
  max: max,
  min: min,
}
export function filterByQualification(
  list: ReadonlyArray<Course>,
  // oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- applyQualifictionFunction writes $computed-value onto the qualification's function value
  qualification: Qualification,
  { distinct = false, fullList, counter }: FilterOptions = {},
): Course[] {
  assertKeys(qualification, "$key", "$operator", "$value")
  const value = qualification.$value

  if (typeof value === "object" && !Array.isArray(value)) {
    switch (value.$type) {
      case "boolean":
        if (!("$or" in value) && !("$and" in value)) {
          throw new TypeError(
            `filterByQualification: neither $or nor $and were present in ${JSON.stringify(value)}`,
          )
        }
        break
      case "function":
        applyQualifictionFunction({
          value,
          fullList,
          list,
        })
        break
      default: {
        const unexpected: { $type?: unknown } = value
        throw new TypeError(
          `filterByQualification: ${String(unexpected.$type)} is not a valid type for a query.`,
        )
      }
    }
  }

  let filtered = list.filter((course) =>
    compareCourseToQualification(course, qualification),
  )

  // If we have a limit on the number of courses, then only return the
  // number that we're allowed to accept.
  if (
    counter &&
    (counter.$operator === "$lte" || counter.$operator === "$eq")
  ) {
    filtered = take(filtered, counter.$num)
  }

  if (distinct) {
    filtered = uniqBy(filtered, simplifyCourse)
  }

  return filtered
}

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- writes $computed-value onto value
function applyQualifictionFunction({
  value,
  fullList,
  list,
}: {
  readonly value: QualificationFunctionValue
  readonly fullList?: ReadonlyArray<Course> | undefined
  readonly list: ReadonlyArray<Course>
}): void {
  const func = Object.hasOwn(qualificationFunctionLookup, value.$name)
    ? qualificationFunctionLookup[value.$name]
    : undefined

  if (!func) {
    throw new ReferenceError(
      `applyQualifictionFunction: ${value.$name} is not a valid function name.`,
    )
  }

  const completeList = fullList ?? list
  // we're not passing distinct or counter back to filterByWhereClause here,
  // because this call is not affected by how the results need to be qualified,
  // since it's finding the matches to get a value from.
  const filtered = filterByWhereClause(completeList, value.$where)
  const items = filtered
    .map((c) => c[value.$prop])
    .filter(
      (item): item is QualificationStaticValue =>
        typeof item === "number" || typeof item === "string",
    )
  const computed = func(items)
  // console.log('looked at', completeList)
  // console.log('reduced to', filtered)
  // console.log('came up with', computed)
  value["$computed-value"] = computed
}
