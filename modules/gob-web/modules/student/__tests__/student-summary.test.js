// @flow

import 'jest-styled-components'
import React from 'react'
import {
	CreditSummary,
	DateSummary,
	DegreeSummary,
	Footer,
	Header,
} from '../student-summary'
import {shallow} from 'enzyme'
import {Set, OrderedSet} from 'immutable'

describe('CreditSummary', () => {
	it('renders shallowly', () => {
		const tree = shallow(
			<CreditSummary currentCredits={5} neededCredits={10} />,
		)

		expect(tree).toMatchSnapshot()
	})

	it('handles having fewer credits than needed', () => {
		const tree = shallow(
			<CreditSummary currentCredits={5} neededCredits={10} />,
		)

		expect(tree).toMatchSnapshot()
		expect(tree.text()).not.toContain('Good job!')
	})

	it('handles having exactly the right number of credits', () => {
		const tree = shallow(
			<CreditSummary currentCredits={10} neededCredits={10} />,
		)

		expect(tree).toMatchSnapshot()
		expect(tree.text()).toContain('Good job!')
	})

	it('handles having more credits than needed', () => {
		const tree = shallow(
			<CreditSummary currentCredits={15} neededCredits={10} />,
		)

		expect(tree).toMatchSnapshot()
		expect(tree.text()).toContain('Good job!')
	})
})

describe('DateSummary', () => {
	it('renders', () => {
		const tree = shallow(
			<DateSummary matriculation={2012} graduation={2016} />,
		)

		expect(tree).toMatchSnapshot()
	})

	it('handles graduating before matriculation', () => {
		expect(
			shallow(<DateSummary matriculation={2016} graduation={2012} />),
		).toMatchSnapshot()
	})

	it('handles graduating in three years', () => {
		expect(
			shallow(<DateSummary matriculation={2000} graduation={2003} />),
		).toMatchSnapshot()
	})

	it('handles graduating in four years', () => {
		expect(
			shallow(<DateSummary matriculation={2000} graduation={2004} />),
		).toMatchSnapshot()
	})

	it('handles graduating in five years', () => {
		expect(
			shallow(<DateSummary matriculation={2000} graduation={2005} />),
		).toMatchSnapshot()
	})

	it('handles graduating in six years', () => {
		expect(
			shallow(<DateSummary matriculation={2000} graduation={2006} />),
		).toMatchSnapshot()
	})
})

describe('DegreeSummary', () => {
	const studies = OrderedSet([
		{type: 'degree', name: 'Bachelor of Science', revision: 'latest'},
		{type: 'degree', name: 'Bachelor of Music', revision: 'latest'},
		{type: 'degree', name: 'Bachelor of Arts', revision: 'latest'},
		{type: 'major', name: 'Asian Studies', revision: 'latest'},
		{type: 'major', name: 'Biology', revision: 'latest'},
		{type: 'major', name: 'Computer Science', revision: 'latest'},
		{
			type: 'concentration',
			name: 'Africa and the Americas',
			revision: 'latest',
		},
		{
			type: 'concentration',
			name: 'Biomolecular Science',
			revision: 'latest',
		},
		{type: 'concentration', name: 'China Studies', revision: 'latest'},
		{type: 'emphasis', name: 'Emphasis 1', revision: 'latest'},
		{type: 'emphasis', name: 'Emphasis 2', revision: 'latest'},
		{type: 'emphasis', name: 'Emphasis 3', revision: 'latest'},
	])

	it('renders', () => {
		const tree = shallow(<DegreeSummary studies={Set()} />)
		expect(tree).toMatchSnapshot()
	})

	for (const degreeCount of [0, 1, 2, 3]) {
		for (const majorCount of [0, 1, 2, 3]) {
			for (const concentrationCount of [0, 1, 2, 3]) {
				for (const emphasisCount of [0, 1, 2, 3]) {
					it(`handles ${degreeCount} degrees, ${majorCount} majors, ${concentrationCount} concentrations, and ${emphasisCount} emphases`, () => {
						const tree = shallow(
							<DegreeSummary
								studies={OrderedSet([
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
								])}
							/>,
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
			/>,
		)

		expect(tree).toMatchSnapshot()
	})

	it('handles the "can graduate" status', () => {
		const tree = shallow(
			<Header
				canGraduate={true}
				name="Susan"
				helloMessage="Welcome, "
				showAvatar={true}
			/>,
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
			/>,
		)

		expect(tree).toMatchSnapshot()
	})
})
