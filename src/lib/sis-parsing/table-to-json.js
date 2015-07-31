export default function tableToJson(table) {
	// from http://johndyer.name/html-table-to-json/
	// The first row needs to be the table headers
	let data = []
	let headers = []
	for (let i = 0; i < table.rows[0].cells.length; i++) {
		headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '')
	}
	// go through cells
	for (let i = 1; i < table.rows.length; i++) {
		let tableRow = table.rows[i]
		let rowData = {}
		for (let j = 0; j < tableRow.cells.length; j++) {
			rowData[ headers[j] ] = tableRow.cells[j].innerHTML
		}
		data.push(rowData)
	}
	return data
}
