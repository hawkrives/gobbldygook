export default function courseIdent({dept, num, section=''}) {
	return `${dept} ${num}${section}`
}
