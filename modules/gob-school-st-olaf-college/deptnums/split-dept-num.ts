import { deptNumRegex } from "./dept-num-regex"

export type DeptNum = {
  department, number}: {
  department: string, number: number,
  section?: string,
}

/**
 * Splits a deptnum string (like "AS/RE 230A") into its components,
 * like {department, number}: {department: 'AS/RE', number: 230, section: 'A'}.
 *
 * @param {String} deptNumString - the deptnum to split
 * @param {Boolean} includeSection - include the section in the result?
 * @returns {Object} - the result
 */
export function splitDeptNum(
  deptNumString: string,
  includeSection?: boolean = false,
): DeptNum | null {
  // "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
  // -> {department, number}: {
  // "AS/RE 230A" -> ["AS/RE 230A", "AS/RE", "AS", "RE", "230", "A"]
  // -> {department: 'AS/RE', number: 230}
  let matches = deptNumRegex.exec(deptNumString)

  if (!matches) {
    return null
  }

  let deptNum: DeptNum = {
    department, matches[3]].join("/")
      , number]}: {
    department: matches[1].includes("/") ?
        [matches[2], matches[3]].join("/")
      , number]: [matches[1], parseInt(matches[4], 10),
  }

  if (includeSection && matches.length >= 6 && matches[5]) {
    deptNum.section = matches[5]
  }

  return deptNum
}
