// @flow
import React from 'react'

import {toPrettyTerm} from '@gob/school-st-olaf-college'
import {Card} from '../../components/card'
import {LabelledSelect} from './labelled-select'
import {FlatButton} from '../../components/button'
import toPairs from 'lodash/toPairs'
import Loading from '../../components/loading'
import {
	SORT_BY,
	GROUP_BY,
	type SORT_BY_KEY,
	type GROUP_BY_KEY,
} from './constants'
import {CourseResultsList} from './results-list'
import {Querent} from './querent'

import './searcher.scss'

type Props = {
	onCloseSearcher?: ?() => mixed,
	term?: ?number,
	studentId?: string,
}

type State = {
	query: string,
	groupBy: GROUP_BY_KEY,
	sortBy: SORT_BY_KEY,
	hasQueried: boolean,
}

export class CourseSearcher extends React.Component<Props, State> {
	state = {
		groupBy: 'term',
		sortBy: 'title',
		query: '',
		hasQueried: false,
	}

	handleSortChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({sortBy: (value: any)}))
	}

	handleGroupByChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({groupBy: (value: any)}))
	}

	updateQuery = (query: string) => {
		this.setState(() => ({query}))
	}

	handleQueryChange = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		this.updateQuery(ev.currentTarget.value)
	}

	render() {
		let {groupBy, query, sortBy} = this.state

		let {onCloseSearcher, studentId, term} = this.props

		return (
			<>
				<Card as="header" className="sidebar-heading">
					<h2>
						Course Search
						{term && (
							<>
								<br />({toPrettyTerm(term)})
							</>
						)}
					</h2>
					{onCloseSearcher && (
						<FlatButton
							className="close-sidebar"
							title="Close Search"
							onClick={onCloseSearcher}
						>
							Close
						</FlatButton>
					)}

					<input
						type="search"
						className="search-box"
						value={query}
						placeholder="Search for a course or phrase"
						onChange={this.handleQueryChange}
						// autoFocus={true}
					/>
				</Card>

				<Card className="search-filters">
					<LabelledSelect
						label="Sort by:"
						options={toPairs(SORT_BY)}
						onChange={this.handleSortChange}
						value={sortBy}
					/>

					<LabelledSelect
						label="Group by:"
						options={toPairs(GROUP_BY)}
						onChange={this.handleGroupByChange}
						value={groupBy}
					/>
				</Card>

				<Querent
					key={`${query}-${String(term)}-${groupBy}-${sortBy}`}
					query={query}
					groupBy={groupBy}
					sortBy={sortBy}
					term={term}
				>
					{({error, inProgress, results, didSearch}) => {
						if (error) {
							return (
								<Card className="course-results--notice">
									Something broke :-(
								</Card>
							)
						}

						if (inProgress) {
							return (
								<Card className="course-results--notice">
									<Loading>Searching…</Loading>
								</Card>
							)
						}

						if (results.length === 0) {
							if (!didSearch) {
								return (
									<Card className="course-results--notice">
										Search for something!
									</Card>
								)
							}
							return (
								<Card className="course-results--notice">
									No Results Found
								</Card>
							)
						}

						return (
							<CourseResultsList
								groupedBy={groupBy}
								studentId={studentId}
								results={results}
							/>
						)
					}}
				</Querent>
			</>
		)
	}
}
