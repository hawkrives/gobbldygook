'use strict';

function findMissingNumberBinarySearch(arr) {
	// via http://stackoverflow.com/questions/11385896/find-the-first-missing-number-in-a-sorted-list
	var len = arr.length

	var first = 0
	var last = len - 1
	var middle = Math.floor((first + last) / 2)

	while ( first < last ) {
		if ( (arr[middle] - arr[first]) != (middle - first) ) {
			// there is a hole in the first half
			if ( (middle - first) == 1 && (arr[middle] - arr[first] > 1) ) {
				return ( arr[middle] - 1 )
			}
			last = middle
		}

		else if ( (arr[last] - arr[middle]) != (last - middle) ) {
			// there is a hole in the second half
			if ( (last - middle) == 1 && (arr[last] - arr[middle] > 1) ) {
				return ( arr[middle] + 1 )
			}
			first = middle
		}

		else {
			return -1
		}

		middle = Math.floor((first + last) / 2)
	}

	// there is no hole
	return -1
}

module.exports = findMissingNumberBinarySearch
