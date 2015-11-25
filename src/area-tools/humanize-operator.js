export default function humanizeOperator(operator) {
	if (operator === '$gte') {
		return ''
	}
	else if (operator === '$lte') {
		return 'at most'
	}
	else if (operator === '$eq') {
		return 'exactly'
	}
}
