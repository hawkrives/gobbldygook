import forEach from 'lodash/collection/forEach'

export default function findAreasOfStudy(areas, degreeType) {
	let areasOfStudy = []

	if (degreeType === 'B.A.') {
		areasOfStudy.push({
			type: 'degree',
			name: 'Bachelor of Arts',
			revision: '2014-15',
		})
	}

	if (degreeType === 'B.M.') {
		areasOfStudy.push({
			type: 'degree',
			name: 'Bachelor of Music',
			revision: '2014-15',
		})
	}

	forEach(areas.majors, area => {
		areasOfStudy.push({
			type: 'major',
			name: area,
			revision: 'latest',
		})
	})

	forEach(areas.concentrations, area => {
		areasOfStudy.push({
			type: 'concentration',
			name: area,
			revision: 'latest',
		})
	})

	forEach(areas.emphases, area => {
		areasOfStudy.push({
			type: 'emphasis',
			name: area,
			revision: 'latest',
		})
	})

	return areasOfStudy
}
