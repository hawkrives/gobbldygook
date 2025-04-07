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
import {render} from '@testing-library/react'
import {List} from 'immutable'

describe('CreditSummary', () => {
	it('renders shallowly', () => {
		const {container} = render(
			<CreditSummary currentCredits={5} neededCredits={10} />,
		)

		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles having fewer credits than needed', () => {
		const {container} = render(
			<CreditSummary currentCredits={5} neededCredits={10} />,
		)

		expect(container.firstChild).toMatchSnapshot()
		expect(container.textContent).not.toContain('Good job!')
	})

	it('handles having exactly the right number of credits', () => {
		const {container} = render(
			<CreditSummary currentCredits={10} neededCredits={10} />,
		)

		expect(container.firstChild).toMatchSnapshot()
		expect(container.textContent).toContain('Good job!')
	})

	it('handles having more credits than needed', () => {
		const {container} = render(
			<CreditSummary currentCredits={15} neededCredits={10} />,
		)

		expect(container.firstChild).toMatchSnapshot()
		expect(container.textContent).toContain('Good job!')
	})
})

describe('DateSummary', () => {
	it('renders', () => {
		const {container} = render(
			<DateSummary matriculation={2012} graduation={2016} />,
		)

		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles graduating before matriculation', () => {
		const {container} = render(
			<DateSummary matriculation={2016} graduation={2012} />,
		)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles graduating in three years', () => {
		const {container} = render(
			<DateSummary matriculation={2000} graduation={2003} />,
		)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles graduating in four years', () => {
		const {container} = render(
			<DateSummary matriculation={2000} graduation={2004} />,
		)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles graduating in five years', () => {
		const {container} = render(
			<DateSummary matriculation={2000} graduation={2005} />,
		)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles graduating in six years', () => {
		const {container} = render(
			<DateSummary matriculation={2000} graduation={2006} />,
		)
		expect(container.firstChild).toMatchSnapshot()
	})
})

describe('DegreeSummary', () => {
	const studies = List([
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
		const {container} = render(<DegreeSummary studies={List()} />)
		expect(container.firstChild).toMatchSnapshot()
	})

	for (const degreeCount of [0, 1, 2, 3]) {
		for (const majorCount of [0, 1, 2, 3]) {
			for (const concentrationCount of [0, 1, 2, 3]) {
				for (const emphasisCount of [0, 1, 2, 3]) {
					it(`handles ${degreeCount} degrees, ${majorCount} majors, ${concentrationCount} concentrations, and ${emphasisCount} emphases`, () => {
						const {container} = render(
							<DegreeSummary
								studies={List([
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

						expect(container.textContent).toMatchSnapshot()
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
		const {container} = render(<Footer canGraduate={true} />)

		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles the "can graduate" status', () => {
		const {container} = render(<Footer canGraduate={true} />)

		expect(container.firstChild).toMatchSnapshot()
		expect(container.textContent).toContain(goodMessage)
		expect(container.textContent).not.toContain(badMessage)
	})

	it('handles the "cannot graduate" status', () => {
		const {container} = render(<Footer canGraduate={false} />)

		expect(container.firstChild).toMatchSnapshot()
		expect(container.textContent).toContain(badMessage)
		expect(container.textContent).not.toContain(goodMessage)
	})
})

describe('Header', () => {
	it('renders', () => {
		const {container} = render(
			<Header
				canGraduate={true}
				name="Susan"
				helloMessage="Welcome, "
				showAvatar={true}
			/>,
		)

		expect(container.firstChild).toMatchSnapshot()
	})

	it('handles the "can graduate" status', () => {
		const {container} = render(
			<Header
				canGraduate={true}
				name="Susan"
				helloMessage="Welcome, "
				showAvatar={true}
			/>,
		)

		expect(container.firstChild).toMatchSnapshot()
	})
	it('handles the "cannot graduate" status', () => {
		const {container} = render(
			<Header
				canGraduate={false}
				name="Susan"
				helloMessage="Welcome, "
				showAvatar={true}
			/>,
		)

		expect(container.firstChild).toMatchSnapshot()
	})
})
