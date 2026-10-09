/**
 * Builds a deptnum string from a course.
 *
 * @param {Course} course - the course
 * @param {Boolean} includeSection - whether or not to include the section in the result
 * @returns {String} - the deptnum string
 */
export function buildDeptNum(
  course: {
    readonly department: string
    readonly number: number | string
    readonly section?: string
    readonly type?: string
  },
  includeSection: boolean = false,
): string {
  const { department, number, section = "", type } = course
  const deptnumString = `${department} ${number}`

  if (includeSection) {
    if (type === "Lab") {
      return `${deptnumString}${section}[L]`
    }

    return `${deptnumString}${section}`
  }

  if (type === "Lab") {
    return `${deptnumString}[L]`
  }

  return deptnumString
}
