export default function computeCountWithOperator({comparator, has, needs}) {
	// compute the result
	if (comparator === '$lte') {
		return has <= needs
	}
	else if (comparator === '$gte') {
		return has >= needs
	}
	else if (comparator === '$eq') {
		return has === needs
	}

	throw new TypeError(`computeModifier(): "${comparator}" must be one of $eq, $lte, or $gte.`)
}
