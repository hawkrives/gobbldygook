export default function cleanUpPage(html) {
	if (!('querySelector' in html)) {
		throw new Error('cleanUpPage(): html must be a document!')
	}

	// Remove the topnav
	let topNav = html.querySelector('.topnav')
	topNav.parentNode.removeChild(topNav)

	let sidebar = html.querySelector('table td:nth-child(1)')
	sidebar.parentNode.removeChild(sidebar)

	// Delve deep within the table structure
	let main = html.querySelector('table td')

	// Get all tables.
	let tonsOfTables = main.querySelectorAll('table')
	// Remove the breadcrumb bar
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0])
	// Refresh the lsit of tables
	tonsOfTables = main.querySelectorAll('table')
	// Remove the "Degree Audit(s)" header
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0])
	// Refresh the list of tables
	tonsOfTables = main.querySelectorAll('table')
	// Remove the "B.{A,M}. Degree Audit for <name>" header
	let degreeType = tonsOfTables[0].textContent.trim().split(' ')[0]
	tonsOfTables[0].parentNode.removeChild(tonsOfTables[0])

	// Now to remove the parent tables
	let tables = Array.prototype.slice.call(main.querySelectorAll('table'))

	// Remove the first parent table
	tables.splice(0, 1)
	// Remove the General Graduation Requirements parent table
	tables.splice(2, 1)
	// Remove the info table and count of s/u courses
	tables.splice(3, 2)

	return [tables, degreeType]
}
