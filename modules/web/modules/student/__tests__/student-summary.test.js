// @flow

import React from 'react'
import { CreditSummary } from '../student-summary'
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
