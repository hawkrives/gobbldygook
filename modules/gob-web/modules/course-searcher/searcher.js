// @flow
import React from 'react'

import {toPrettyTerm, expandYear} from '@gob/school-st-olaf-college'
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
	limitTo: string,
	filterBy: string,
	hasQueried: boolean,
}

export class CourseSearcher extends React.Component<Props, State> {
	state = {
		groupBy: 'term',
		sortBy: 'title',
		limitTo: '',
		filterBy: '',
		query: '',
		hasQueried: false,
	}

	handleSortChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({sortBy: (value: any)}))
	}

	handleGroupByChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({groupBy: (value: any), filterBy: ''}))
	}

	handleFilterByChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({filterBy: (value: any)}))
	}

	handleLimitToChange = (ev: SyntheticEvent<HTMLSelectElement>) => {
		let value: string = ev.currentTarget.value
		this.setState(() => ({limitTo: (value: any)}))
	}

	updateQuery = (query: string) => {
		this.setState(() => ({query}))
	}

	handleQueryChange = (ev: SyntheticKeyboardEvent<HTMLInputElement>) => {
		this.updateQuery(ev.currentTarget.value)
	}

	render() {
		let {groupBy, query, sortBy, filterBy, limitTo} = this.state

		let {onCloseSearcher, studentId, term} = this.props

		// This tells React to unmount and recreate the search hierarchy, so that it all updates as we type
		let termKey = String(term)
		let key = `${query}-${termKey}-${groupBy}-${sortBy}-${filterBy}-${limitTo}`

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

				<Querent
					key={key}
					query={query}
					groupBy={groupBy}
					sortBy={sortBy}
					term={term}
					filterBy={filterBy}
					limitTo={limitTo}
				>
					{({error, inProgress, results, didSearch, keys, years}) => {
						if (error) {
							return (
								<Card className="course-results--notice">
									Something broke :-(
								</Card>
							)
						}

						let potentialFilters = keys.map(k => [k, k])
						potentialFilters.unshift(['', 'No Filter'])

						let potentialYearLimits = years
							.map(k => [String(k), expandYear(k)])
							.toArray()
						potentialYearLimits.unshift(['', 'All Years'])

						if (limitTo && !years.has(parseInt(limitTo, 10))) {
							potentialYearLimits.push([
								limitTo,
								expandYear(limitTo),
							])
						}

						let filters = (
							<Card className="search-filters">
								<LabelledSelect
									label="Limit to:"
									options={potentialYearLimits}
									onChange={this.handleLimitToChange}
									value={limitTo}
								/>

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

								<LabelledSelect
									label="Filter by:"
									options={potentialFilters}
									onChange={this.handleFilterByChange}
									value={filterBy}
								/>
							</Card>
						)

						if (inProgress) {
							return (
								<>
									{filters}
									<Card className="course-results--notice">
										<Loading>Searching…</Loading>
									</Card>
								</>
							)
						}

						if (results.size === 0) {
							if (!didSearch) {
								return (
									<Card className="course-results--notice">
										Search for something!
									</Card>
								)
							}
							return (
								<>
									{filters}
									<Card className="course-results--notice">
										No Results Found
									</Card>
								</>
							)
						}

						return (
							<>
								{filters}

								<CourseResultsList
									groupedBy={groupBy}
									studentId={studentId}
									results={results}
								/>
							</>
						)
					}}
				</Querent>
			</>
		)
	}
}
