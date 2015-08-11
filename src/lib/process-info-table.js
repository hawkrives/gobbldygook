import forEach from 'lodash/collection/forEach'

export default function processInfoTable(infoTable) {
	let info = {}
	forEach(infoTable.rows, row => {
		let rowName = row.cells[0].textContent.replace(/:$/, '').toLowerCase()
		info[rowName] = row.cells[1].textContent
	})

	info.graduation = parseInt(info['class year'])
	delete info['class year']
	info.matriculation = parseInt(info['curriculum year'])
	delete info['curriculum year']
	info.standing = info['academic standing']
	delete info['academic standing']

	return info
}
