// @flow
import { normalizeDepartment } from 'modules/hanson-format'

/**
 * Builds a department string from a course.
 *
 *    AS/RE => ASIAN/REL
 *    ASIAN/REL => ASIAN/REL
 *    ASIAN/RELIGION => ASIAN/REL
 *
 * @param {String[]} departments - the course departments
 * @returns {String} - the department string
 */
export function buildDeptString(departments: string[]) {
  if (!departments || !departments.length) {
    return 'NONE'
  }

  return departments.map(normalizeDepartment).join('/')
}
