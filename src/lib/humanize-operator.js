export default function humanizeOperator(operator) {
	if (operator === '$gte') {
		return 'at least'
	}
	else if (operator === '$lte') {
		return 'at most'
	}
	else if (operator === '$eq') {
		return 'exactly'
	}
}
