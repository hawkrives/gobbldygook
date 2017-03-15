// @flow
'use strict'
// via http://stackoverflow.com/questions/11385896/find-the-first-missing-number-in-a-sorted-list
function findMissingNumberBinarySearch(arr: number[]): ?number {
	let first = 0
	let last = arr.length - 1
	let middle = Math.floor((first + last) / 2)

	while ( first < last ) {
		if ( (arr[middle] - arr[first]) !== (middle - first) ) {
			// there is a hole in the first half
			if ( (middle - first) === 1 && (arr[middle] - arr[first] > 1) ) {
				return ( arr[middle] - 1 )
			}
			last = middle
		}

		else if ( (arr[last] - arr[middle]) !== (last - middle) ) {
			// there is a hole in the second half
			if ( (last - middle) === 1 && (arr[last] - arr[middle] > 1) ) {
				return ( arr[middle] + 1 )
			}
			first = middle
		}

		else {
			return null
		}

		middle = Math.floor((first + last) / 2)
	}

	// there is no hole
	return null
}

module.exports.findMissingNumberBinarySearch = findMissingNumberBinarySearch
