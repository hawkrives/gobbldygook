import test from 'ava'
import {loadHtml} from './_support'
import {getGraduationInformation} from '../graduation-info'

test('extracts information about the degrees', t => {
	const html = loadHtml('degree-audit')
	const actual = getGraduationInformation(html)
	const expected = [
		{
			'name': 'Student M. Name',
			'advisor': 'Advisor, Name O.',
			'academic standing': 'Good',
			'degree': 'Bachelor of Arts',
			'majors': ['Computer Science', 'Asian Studies'],
			'concentrations': ['Japan Studies'],
			'emphases': [],
			'matriculation': 2012,
			'graduation': 2016,
		},
	]
	t.deepEqual(actual, expected)
})
