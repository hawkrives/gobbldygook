// @flow

import React from 'react'
import {
    CreditSummary,
    DateSummary,
    DegreeSummary,
    Footer,
    Header,
    StudentSummary,
} from '../student-summary'
import { Student } from '../../../../../modules/object-student/student'
import { shallow } from 'enzyme'

const mockStudent = () =>
    Student({
        name: 'test',
        id: '0xabadidea',
        matriculation: 2015,
        graduation: 2019,
        dateCreated: new Date('2017-03-17T02:03:33.974Z'),
        dateLastModified: new Date('2017-03-17T02:03:33.974Z'),
    })

describe('CreditSummary', () => {
    it('renders shallowly', () => {
        const tree = shallow(
            <CreditSummary currentCredits={5} neededCredits={10} />
        )

        expect(tree).toMatchSnapshot()
    })

    it('handles having fewer credits than needed', () => {
        const tree = shallow(
            <CreditSummary currentCredits={5} neededCredits={10} />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.text()).not.toContain('Good job!')
    })

    it('handles having exactly the right number of credits', () => {
        const tree = shallow(
            <CreditSummary currentCredits={10} neededCredits={10} />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.text()).toContain('Good job!')
    })

    it('handles having more credits than needed', () => {
        const tree = shallow(
            <CreditSummary currentCredits={15} neededCredits={10} />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.text()).toContain('Good job!')
    })
})

describe('DateSummary', () => {
    it('renders', () => {
        const tree = shallow(
            <DateSummary matriculation="2012" graduation="2016" />
        )

        expect(tree).toMatchSnapshot()
    })

    it('handles graduating before matriculation', () => {
        expect(
            shallow(<DateSummary matriculation="2016" graduation="2012" />)
        ).toMatchSnapshot()
    })

    it('handles graduating in three years', () => {
        expect(
            shallow(<DateSummary matriculation="2000" graduation="2003" />)
        ).toMatchSnapshot()
    })

    it('handles graduating in four years', () => {
        expect(
            shallow(<DateSummary matriculation="2000" graduation="2004" />)
        ).toMatchSnapshot()
    })

    it('handles graduating in five years', () => {
        expect(
            shallow(<DateSummary matriculation="2000" graduation="2005" />)
        ).toMatchSnapshot()
    })

    it('handles graduating in six years', () => {
        expect(
            shallow(<DateSummary matriculation="2000" graduation="2006" />)
        ).toMatchSnapshot()
    })

    it('disables editing the matriculation year if onChangeMatriculation is not given', () => {
        const tree = shallow(
            <DateSummary matriculation="2012" graduation="2016" />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(0).prop('disabled')).toBe(true)
    })

    it('disables editing the graduation year if onChangeGraduation is not given', () => {
        const tree = shallow(
            <DateSummary matriculation="2012" graduation="2016" />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(1).prop('disabled')).toBe(true)
    })

    it('allows editing the matriculation year if onChangeMatriculation is given', () => {
        const onChangeMatriculation = jest.fn()
        const tree = shallow(
            <DateSummary
                onChangeMatriculation={onChangeMatriculation}
                matriculation="2012"
                graduation="2016"
            />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(0).prop('disabled')).toBe(false)
    })

    it('allows editing the graduation year if onChangeGraduation is given', () => {
        const onChangeGraduation = jest.fn()
        const tree = shallow(
            <DateSummary
                onChangeGraduation={onChangeGraduation}
                matriculation="2012"
                graduation="2016"
            />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(1).prop('disabled')).toBe(false)
    })

    it('calls onChangeMatriculation when the matriculation year is changed', () => {
        const onChangeMatriculation = jest.fn()
        const tree = shallow(
            <DateSummary
                onChangeMatriculation={onChangeMatriculation}
                matriculation="2012"
                graduation="2016"
            />
        )

        expect(tree).toMatchSnapshot()
        tree.find('ContentEditable').at(0).simulate('blur', '2010')
        expect(onChangeMatriculation).toHaveBeenCalledWith('2010')
    })

    it('calls onChangeGraduation when the graduation year is changed', () => {
        const onChangeGraduation = jest.fn()
        const tree = shallow(
            <DateSummary
                onChangeGraduation={onChangeGraduation}
                matriculation="2012"
                graduation="2016"
            />
        )

        expect(tree).toMatchSnapshot()
        tree.find('ContentEditable').at(1).simulate('blur', '2018')
        expect(onChangeGraduation).toHaveBeenCalledWith('2018')
    })
})

describe('DegreeSummary', () => {
    const studies = [
        { type: 'degree', name: 'Bachelor of Science' },
        { type: 'degree', name: 'Bachelor of Music' },
        { type: 'degree', name: 'Bachelor of Arts' },
        { type: 'major', name: 'Asian Studies' },
        { type: 'major', name: 'Biology' },
        { type: 'major', name: 'Computer Science' },
        { type: 'concentration', name: 'Africa and the Americas' },
        { type: 'concentration', name: 'Biomolecular Science' },
        { type: 'concentration', name: 'China Studies' },
        { type: 'emphasis', name: 'Emphasis 1' },
        { type: 'emphasis', name: 'Emphasis 2' },
        { type: 'emphasis', name: 'Emphasis 3' },
    ]

    it('renders', () => {
        const tree = shallow(<DegreeSummary studies={[]} />)
        expect(tree).toMatchSnapshot()
    })

    for (const degreeCount of [0, 1, 2, 3]) {
        for (const majorCount of [0, 1, 2, 3]) {
            for (const concentrationCount of [0, 1, 2, 3]) {
                for (const emphasisCount of [0, 1, 2, 3]) {
                    it(`handles ${degreeCount} degrees, ${majorCount} majors, ${concentrationCount} concentrations, and ${emphasisCount} emphases`, () => {
                        const tree = shallow(
                            <DegreeSummary
                                studies={[
                                    ...studies
                                        .filter(s => s.type === 'degree')
                                        .slice(0, degreeCount),
                                    ...studies
                                        .filter(s => s.type === 'major')
                                        .slice(0, majorCount),
                                    ...studies
                                        .filter(s => s.type === 'concentration')
                                        .slice(0, concentrationCount),
                                    ...studies
                                        .filter(s => s.type === 'emphasis')
                                        .slice(0, emphasisCount),
                                ]}
                            />
                        )

                        expect(tree.text()).toMatchSnapshot()
                    })
                }
            }
        }
    }
})

describe('Footer', () => {
    const goodMessage = "It looks like you'll make it!"
    const badMessage = "You haven't planned everything out yet."
    it('renders', () => {
        const tree = shallow(<Footer canGraduate={true} />)

        expect(tree).toMatchSnapshot()
    })

    it('handles the "can graduate" status', () => {
        const tree = shallow(<Footer canGraduate={true} />)

        expect(tree).toMatchSnapshot()
        expect(tree.text()).toContain(goodMessage)
        expect(tree.text()).not.toContain(badMessage)
    })

    it('handles the "cannot graduate" status', () => {
        const tree = shallow(<Footer canGraduate={false} />)

        expect(tree).toMatchSnapshot()
        expect(tree.text()).toContain(badMessage)
        expect(tree.text()).not.toContain(goodMessage)
    })
})

describe('Header', () => {
    it('renders', () => {
        const tree = shallow(
            <Header
                canGraduate={true}
                name="Susan"
                helloMessage="Welcome, "
                showAvatar={true}
            />
        )

        expect(tree).toMatchSnapshot()
    })

    describe('with an avatar', () => {
        it('handles the "can graduate" status', () => {
            const tree = shallow(
                <Header
                    canGraduate={true}
                    name="Susan"
                    helloMessage="Welcome, "
                    showAvatar={true}
                />
            )

            expect(tree).toMatchSnapshot()
        })
        it('handles the "cannot graduate" status', () => {
            const tree = shallow(
                <Header
                    canGraduate={false}
                    name="Susan"
                    helloMessage="Welcome, "
                    showAvatar={true}
                />
            )

            expect(tree).toMatchSnapshot()
        })
    })

    describe('without an avatar', () => {
        it('handles the "can graduate" status', () => {
            const tree = shallow(
                <Header
                    canGraduate={true}
                    name="Susan"
                    helloMessage="Welcome, "
                    showAvatar={false}
                />
            )

            expect(tree).toMatchSnapshot()
        })
        it('handles the "cannot graduate" status', () => {
            const tree = shallow(
                <Header
                    canGraduate={false}
                    name="Susan"
                    helloMessage="Welcome, "
                    showAvatar={false}
                />
            )

            expect(tree).toMatchSnapshot()
        })
    })

    it('disables editing the name if onChangeName is not given', () => {
        const tree = shallow(
            <Header
                canGraduate={false}
                name="Natasha"
                helloMessage="Welcome, "
                showAvatar={true}
            />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(0).prop('disabled')).toBe(true)
    })
    it('allows editing the name if onChangeName is given', () => {
        const onChangeName = jest.fn()
        const tree = shallow(
            <Header
                canGraduate={false}
                onChangeName={onChangeName}
                name="Natasha"
                helloMessage="Welcome, "
                showAvatar={true}
            />
        )

        expect(tree).toMatchSnapshot()
        expect(tree.find('ContentEditable').at(0).prop('disabled')).toBe(false)
    })

    it('calls onChangeName when the name is changed', () => {
        const onChangeName = jest.fn()
        const tree = shallow(
            <Header
                canGraduate={false}
                onChangeName={onChangeName}
                name="Natasha"
                helloMessage="Welcome, "
                showAvatar={true}
            />
        )

        expect(tree).toMatchSnapshot()
        tree.find('ContentEditable').at(0).simulate('blur', 'Black Widow')
        expect(onChangeName).toHaveBeenCalledWith('Black Widow')
    })
})

describe('StudentSummary', () => {
    it('renders', () => {
        const tree = shallow(<StudentSummary student={mockStudent()} />)
        expect(tree).toMatchSnapshot()
    })
})
