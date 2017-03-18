// @flow

import React from 'react'
import { CreditSummary, DateSummary } from '../student-summary'
import { shallow } from 'enzyme'

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

    it('allows editing the matriculation year if onChangeMatriculation is not given', () => {
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

    it('allows editing the graduation year if onChangeGraduation is not given', () => {
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
