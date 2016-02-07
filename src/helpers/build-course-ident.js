export default function courseIdent({dept, num, section='', deptnum}) {
	deptnum = deptnum || `${dept} ${num}`
	return `${deptnum}` + (section ? section : '')
}
