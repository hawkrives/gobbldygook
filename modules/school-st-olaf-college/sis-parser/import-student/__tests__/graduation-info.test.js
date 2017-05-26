import { loadHtml } from './import-student.support'
import { getGraduationInformation } from '../graduation-info'

describe('getGraduationInformation', () => {
    it('extracts information about the degrees', () => {
        const html = loadHtml('degree-audit')
        const actual = getGraduationInformation(html)
        const expected = [
            {
                name: 'Student M. Name',
                advisor: 'Advisor, Name O.',
                'academic standing': 'Good',
                degree: 'Bachelor of Arts',
                majors: ['Computer Science', 'Asian Studies'],
                concentrations: ['Japan Studies'],
                emphases: [],
                matriculation: 2012,
                graduation: 2016,
            },
        ]
        expect(actual).toEqual(expected)
    })
})
