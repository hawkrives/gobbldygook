import includes from 'lodash/includes'
import {extractInformationFromDegreeAudit} from './degree-audit'
import {selectAll} from 'css-select'

export function getGraduationInformation(dom) {
	// #bigbodymainstyle
	//   table  (top navigation)
	//   form
	//   form
	//   table  (side navigation)
	//   td  (degree audits)
	//     table  (a thing?)
	//     div.noprint  (header + navigation dropdown)
	//     a[name=degree1]  (the anchor for the first degree)
	//     table[width=100%]  (the header for the degree audit – B.A. Degree Audit for Name)
	//       tr > td > h3
	//     p  (info table)
	//       font
	//         b  (responsibility paragraph)
	//         <text>  ("this is an unofficial audit")
	//         p
	//           table
	//             tr
	//               td
	//                 table
	//                   tr
	//                     td, td  (name, student name)
	//                   tr
	//                     td, td  (advisor, name)
	//                   tr
	//                     td, td  (class year, year)
	//                   tr
	//                     td, td  (curriculum year, year)
	//                   tr
	//                     td, td  (academic standing, quality)
	//               td
	//                 table
	//                   tr
	//                     th  ("Majors")
	//                     th  ("Emphases")
	//                     th  ("Concentrations")
	//                   tr  (this row is repeated as many times as needed)
	//                     td  (major)
	//                     td  (emphasis)
	//                     td  (concentration)

	// htmlparser2 appears to have a different algorithm for correcting HTML than browsers do.
	// Thus, the <td> that we want isn't contained within the table, but within the container div itself.
	// Se we'll just collect everything underneath it.
	let elements = selectAll('#bigbodymainstyle > td:first-of-type > *', dom)
	let tagNames = elements.map(el => el.name)

	let degrees = []
	// I believe that, if you have two degrees, there are two anchors: degree1 and degree2.
	while (includes(tagNames, 'a')) {
		let degreeAnchorIndex = tagNames.indexOf('a')
		let degreeAuditInfo = elements[degreeAnchorIndex+2]
		let degreeInfoTable = elements[degreeAnchorIndex+3]
		let degree = extractInformationFromDegreeAudit(degreeAuditInfo, degreeInfoTable)
		degrees.push(degree)

		// Once we've collected a degree, we remove every tag name up past the index of the currect <a>.
		tagNames = tagNames.slice(degreeAnchorIndex + 1)
		elements = elements.slice(degreeAnchorIndex + 1)
		// If there's another degree, then let's do it again!
	}

	return degrees
}
