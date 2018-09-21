// @flow

export function partitionByIndex<T, U>(arr: Array<T | U>): [T[], U[]] {
	let reduced = arr.reduce(
		(acc, val, idx) => {
			return idx % 2 === 0
				? [acc[0].concat(val), acc[1]]
				: [acc[0], acc[1].concat(val)]
		},
		[[], []],
	)
	return (reduced: any)
}
