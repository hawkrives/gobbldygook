export default function courseIdent({dept, num, section='', deptnum}) {
	if (deptnum) {
		return deptnum
	}
	return `${dept} ${num}${section}`
}
