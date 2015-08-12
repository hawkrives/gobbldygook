import reduce from 'lodash/collection/reduce'

export default function processInfoTable(infoTable) {
	let info = reduce(infoTable.rows, (obj, row) => {
		const rowName = row.cells[0].textContent.replace(/:$/, '').toLowerCase()
		obj[rowName] = row.cells[1].textContent
		return obj
	}, {})

	info.graduation = parseInt(info['class year'])
	delete info['class year']
	info.matriculation = parseInt(info['curriculum year'])
	delete info['curriculum year']
	info.standing = info['academic standing']
	delete info['academic standing']

	return info
}
