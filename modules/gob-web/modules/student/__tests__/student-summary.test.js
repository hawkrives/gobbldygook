// @flow
import 'jest-styled-components'
import React from 'react'
import {render, screen} from '@testing-library/react'
import {
	CreditSummary,
	DateSummary,
	DegreeSummary,
	Footer,
	Header,
} from '../student-summary'
import {List} from 'immutable'

describe('CreditSummary', () => {
	it('renders planned vs required', () => {
		render(<CreditSummary currentCredits={5} neededCredits={10} />)
		expect(
			screen.getByText(
				/You have currently planned for 5 of your 10 required credits/,
			),
		).toBeInTheDocument()
	})

	it('handles having fewer credits than needed', () => {
		render(<CreditSummary currentCredits={5} neededCredits={10} />)
		expect(screen.queryByText('Good job!')).toBeNull()
	})

	it('handles having exactly the right number of credits', () => {
		render(<CreditSummary currentCredits={10} neededCredits={10} />)
		expect(
			screen.getByText(
				/You have currently planned for 10 of your 10 required credits/,
			),
		).toBeInTheDocument()
	})

	it('handles having more credits than needed', () => {
		render(<CreditSummary currentCredits={15} neededCredits={10} />)
		expect(
			screen.getByText(
				/You have currently planned for 15 of your 10 required credits/,
			),
		).toBeInTheDocument()
	})
})

describe('DateSummary', () => {
	it('renders years', () => {
		render(<DateSummary matriculation={2012} graduation={2016} />)
		expect(screen.getByText(/matriculating in 2012/)).toBeInTheDocument()
		expect(screen.getByText(/graduate in 2016/)).toBeInTheDocument()
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

	it('renders empty', () => {
		render(<DegreeSummary studies={List()} />)
		expect(
			screen.getByText(/You are planning on no degrees/),
		).toBeInTheDocument()
	})

	it('renders counts', () => {
		render(
			<DegreeSummary
				studies={List([
					...studies.filter(s => s.type === 'degree').slice(0, 2),
					...studies.filter(s => s.type === 'major').slice(0, 2),
					...studies
						.filter(s => s.type === 'concentration')
						.slice(0, 1),
					...studies.filter(s => s.type === 'emphasis').slice(0, 1),
				])}
			/>,
		)
		expect(screen.getByText(/You are planning on/)).toBeInTheDocument()
	})
})

describe('Footer', () => {
	const goodMessage = "It looks like you'll make it!"
	const badMessage = "You haven't planned everything out yet."
	it('handles the "can graduate" status', () => {
		render(<Footer canGraduate={true} />)
		expect(
			screen.getByText(goodMessage, {exact: false}),
		).toBeInTheDocument()
		expect(screen.queryByText(badMessage, {exact: false})).toBeNull()
	})

	it('handles the "cannot graduate" status', () => {
		render(<Footer canGraduate={false} />)
		expect(screen.getByText(badMessage, {exact: false})).toBeInTheDocument()
		expect(screen.queryByText(goodMessage, {exact: false})).toBeNull()
	})
})

describe('Header', () => {
	it('renders greeting with name', () => {
		render(
			<Header
				canGraduate={true}
				name={'Susan'}
				helloMessage={'Welcome, '}
				showAvatar={true}
			/>,
		)
		expect(screen.getByText(/^Welcome, Susan!$/)).toBeInTheDocument()
	})
})
