import { deptNumRegex } from "./dept-num-regex"
// Checks if a string looks like a deptnum.
export function quacksLikeDeptNum(deptNumString: string): boolean {
  return deptNumRegex.test(deptNumString)
}
