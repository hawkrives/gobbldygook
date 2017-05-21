// @flow
import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import max from 'lodash/max'
import min from 'lodash/min'
import take from 'lodash/take'
import uniqBy from 'lodash/uniqBy'
import assertKeys from './assert-keys'
import compareCourseToQualification from './compare-course-to-qualification'
import simplifyCourse from './simplify-course'
import type {
    Course,
    Qualifier,
    Qualification,
    Counter,
    QualificationFunctionValue,
} from './types'
import debug from 'debug'
const log = debug('examine-student:filter-by-where-clause')

export default function filterByWhereClause(
    baseList: Course[],
    clause: Qualifier,
    {
        distinct,
        fullList,
        counter,
    }: { distinct: boolean, fullList?: Course[], counter?: Counter } = {}
) {
    // When filtering by an and-clause, we need access to both the
    // entire list of courses, and the result of the prior iteration.
    // To simplify future invocations, we default to `fullList = list`
    if (!fullList) {
        fullList = baseList
    }

    // There are only two types of where-clauses: boolean, and qualification.
    // Boolean where-clauses are comprised of a set of qualifications.

    // This function always reduces down to a call to filterByQualification
    if (clause.$type === 'qualification') {
        return filterByQualification(baseList, clause, {
            distinct,
            fullList,
            counter,
        })
    } else if (clause.$type === 'boolean') {
        // either an and- or or-clause.
        // and-clauses become the result of applying each invocation to the
        // result of the prior one. they are the list of unique courses which
        // meet all of the qualifications.
        if (clause.$booleanType === 'and') {
            let filtered = baseList
            forEach(clause.$and, q => {
                filtered = filterByWhereClause(filtered, q, {
                    distinct,
                    fullList,
                    counter,
                })
            })
            return filtered
        } else if (clause.$booleanType === 'or') {
            // or-clauses are the list of unique courses that meet one or more
            // of the qualifications.
            let filtrations = []
            forEach(clause.$or, q => {
                filtrations = filtrations.concat(
                    filterByWhereClause(baseList, q, { distinct, counter })
                )
            })

            // uniquify the list of possibilities by way of turning them into
            // the simplified representations.
            return uniqBy(filtrations, simplifyCourse)
        } else {
            // only 'and' and 'or' are currently supported.
            throw new TypeError(
                `filterByWhereClause: neither $or nor $and were present in ${JSON.stringify(clause)}`
            )
        }
    } else {
        // where-clauses *must* be either a 'boolean' or a 'qualification'
        throw new TypeError(
            `filterByWhereClause: wth kind of type is a "${clause.$type}" clause?`
        )
    }
}

const qualificationFunctionLookup = {
    max: max,
    min: min,
}

export function filterByQualification(
    list: Course[],
    qualification: Qualification,
    {
        distinct = false,
        fullList,
        counter,
    }: { distinct: boolean, fullList?: Course[], counter?: Counter } = {}
) {
    assertKeys(qualification, '$key', '$operator', '$value')
    const value = qualification.$value

    if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.$type === 'boolean') {
            if (!('$or' in value) && !('$and' in value)) {
                throw new TypeError(
                    `filterByQualification: neither $or nor $and were present in ${JSON.stringify(value)}`
                )
            }
        } else if (value.$type === 'function') {
            applyQualifictionFunction({ value, fullList, list })
        } else {
            throw new TypeError(
                `filterByQualification: ${value.$type} is not a valid type for a query.`
            )
        }
    }

    let filtered = filter(list, course =>
        compareCourseToQualification(course, qualification)
    )

    // If we have a limit on the number of courses, then only return the
    // number that we're allowed to accept.
    if (
        counter &&
        (counter.$operator === '$lte' || counter.$operator === '$eq')
    ) {
        filtered = take(filtered, counter.$num)
    }

    if (distinct) {
        filtered = uniqBy(filtered, simplifyCourse)
    }

    return filtered
}

function applyQualifictionFunction({
    value,
    fullList,
    list,
}: {
    value: QualificationFunctionValue,
    fullList?: Course[],
    list: Course[],
}) {
    const func = qualificationFunctionLookup[value.$name]

    if (!func) {
        throw new ReferenceError(
            `applyQualifictionFunction: ${value.$name} is not a valid function name.`
        )
    }

    const completeList = fullList || list
    // we're not passing distinct or counter back to filterByWhereClause here,
    // because this call is not affected by how the results need to be qualified,
    // since it's finding the matches to get a value from.
    const filtered = filterByWhereClause(completeList, value.$where)
    const items = map(filtered, c => c[value.$prop])
    const computed = func(items)

    log('looked at', completeList)
    log('reduced to', filtered)
    log('came up with', computed)

    value['$computed-value'] = computed
}
