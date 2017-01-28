// @flow
import isPlainObject from 'lodash/isPlainObject'
import includes from 'lodash/includes'
import every from 'lodash/every'
import some from 'lodash/some'
import assertKeys from './assert-keys'
import type { Course, Qualification } from './types'

/**
 * Compares a course property against a MongoDB-style operator
 * @private
 * @param {Course} course - the course to check
 * @param {string} $key - the property to check
 * @param {string} $operator - the operator to check against
 * @param {string} $value - the value compare to
 * @returns {boolean} - whether the course matched or not
 */
export default function compareCourseToQualification(course: Course, { $key, $operator, $value, $type }: Qualification) {
  if (Array.isArray($value)) {
    throw new TypeError("compareCourseToQualification(): what would a comparison to a list even do? oh, wait; I suppose it could compare against one of several values… well, I'm not doing that right now. If you want it, edit the PEG and stick appropriate stuff in here (probably simplest to just call this function again with each possible value and return true if any are true.)")
  }

  else if (isPlainObject($value)) {
    return compareCourseToQualificationViaObject(course, { $key, $operator, $value, $type })
  }

  else {
    return compareCourseToQualificationViaOperator(course, { $key, $operator, $value, $type })
  }
}


function compareCourseToQualificationViaObject(course: Course, { $key, $operator, $value, $type }: Qualification) {
  if (typeof $value !== 'object') {
    throw new TypeError(`compareCourseToQualification(): $value must be an object; "${typeof $value}" is not an object.`)
  }

  if ($value.$type === 'function') {
		// we compute the value of the function-over-where-query style
		// operators earlier, in the filterByQualification function.
    assertKeys($value, '$computed-value')
    const simplifiedOperator = { $key, $operator, $value: $value['$computed-value'], $type: 'qualification' }
    return compareCourseToQualification(course, simplifiedOperator)
  }
  else if ($value.$type === 'boolean') {
    if ($value.$booleanType === 'or') {
      return some($value.$or, val =>
				compareCourseToQualification(course, { $key, $operator, $value: val, $type }))
    }
    else if ($value.$booleanType === 'and') {
      return every($value.$and, val =>
				compareCourseToQualification(course, { $key, $operator, $value: val, $type }))
    }
    else {
      throw new TypeError(`compareCourseToQualification(): neither $or nor $and could be found in ${JSON.stringify($value)}`)
    }
  }
  else {
    throw new TypeError(`compareCourseToQualification(): "${$value.$type}" is not a valid type for a qualification's value.`)
  }
}


function compareCourseToQualificationViaOperator(course: Course, { $key, $operator, $value }: Qualification) {
	// get the actual course out of the object
  course = (course: any).$course || course

	// it's a static value; a number or string
  if ($operator === '$eq') {
    if (Array.isArray(course[$key])) {
      return includes(course[$key], $value)
    }
    return course[$key] === $value
  }
  else if ($operator === '$ne') {
    if (Array.isArray(course[$key])) {
      return !includes(course[$key], $value)
    }
    return course[$key] !== $value
  }
  else if ($operator === '$lt') {
    return course[$key] < $value
  }
  else if ($operator === '$lte') {
    return course[$key] <= $value
  }
  else if ($operator === '$gt') {
    return course[$key] > $value
  }
  else if ($operator === '$gte') {
    return course[$key] >= $value
  }

  else {
    throw new TypeError(`compareCourseToQualificationViaOperator: "${$operator} is not a valid operator"`)
  }
}
