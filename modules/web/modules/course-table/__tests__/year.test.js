// @flow

import React from 'react'
import Year from '../year'
import { Student } from '../../../../../modules/object-student/student'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

const mockStudent = () =>
    Student({
        name: 'test',
        id: '0xabadidea',
        dateCreated: new Date('2017-03-17T02:03:33.974Z'),
        dateLastModified: new Date('2017-03-17T02:03:33.974Z'),
    })

test('Year renders shallowly', () => {
    const addSemester = jest.fn()
    const removeYear = jest.fn()

    const tree = renderer.create(
        <Year
            addSemester={addSemester}
            removeYear={removeYear}
            student={mockStudent()}
            year={2016}
        />
    )

    expect(tree).toMatchSnapshot()
})

test('Year can add a semester', () => {
    const addSemester = jest.fn()
    const removeYear = jest.fn()

    const student = mockStudent()

    const tree = shallow(
        <Year
            addSemester={addSemester}
            removeYear={removeYear}
            student={student}
            year={2016}
        />
    )

    expect(tree).toMatchSnapshot()

    tree.find('Button[title="Add Semester"]').simulate('click')

    expect(addSemester).toHaveBeenCalled()
    expect(removeYear).not.toHaveBeenCalled()

    expect(tree).toMatchSnapshot()
})

test('Year can remove a semester', () => {
    const addSemester = jest.fn()
    const removeYear = jest.fn()

    const student = mockStudent()

    const tree = shallow(
        <Year
            addSemester={addSemester}
            removeYear={removeYear}
            student={student}
            year={2016}
        />
    )

    expect(tree).toMatchSnapshot()

    tree.find('Button[title="Remove the year 2016—2017"]').simulate('click')

    expect(addSemester).not.toHaveBeenCalled()
    expect(removeYear).toHaveBeenCalled()

    expect(tree).toMatchSnapshot()
})

