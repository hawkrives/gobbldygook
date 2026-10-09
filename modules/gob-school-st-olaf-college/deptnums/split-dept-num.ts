import { deptNumRegex } from "./dept-num-regex"
export type DeptNum = {
  department: string
  number: number
  section?: string
}

/**
 * Splits a deptnum string (like "AS/RE 230A") into its components,
 * like {department: 'AS/RE', number: 230, section: 'A'}.
 *
 * @param {String} deptNumString - the deptnum to split
 * @param {Boolean} includeSection - include the section in the result?
 * @returns {Object} - the result
 */
export function splitDeptNum(
  deptNumString: string,
  includeSection: boolean = false,
): DeptNum | null {
  // "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
  // -> {department: 'AS/RE', number: 230}
  const matches = deptNumRegex.exec(deptNumString)
  if (!matches) {
    return null
  }

  // A match always has the combined department (1) and the number (4); the
  // two halves of a cross-listed department (2, 3) are set only for "AS/RE".
  const [, department = "", firstDept, secondDept, number = "", section] =
    matches

  const deptNum: DeptNum = {
    department: department.includes("/")
      ? [firstDept, secondDept].join("/")
      : department,
    number: parseInt(number, 10),
  }

  if (includeSection && section !== undefined && section !== "") {
    deptNum.section = section
  }

  return deptNum
}
