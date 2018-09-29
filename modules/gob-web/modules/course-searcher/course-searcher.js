// @flow
import React from 'react'

import {toPrettyTerm} from '@gob/school-st-olaf-college'

import {LabelledSelect} from './labelled-select'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import Loading from '../../components/loading'
import CourseResultsList from './course-results-list'
import {androidArrowForward} from '../../icons/ionicons'
import styled, {css} from 'styled-components'

import {sortByOptions, groupByOptions} from './course-searcher-options'

import './course-searcher.scss'

const Card = css`
	background-color: white;
	border-radius: var(--base-border-radius);
	border: 1px solid;
	border-color: #e5e6e9 #dfe0e4 #d0d1d5;

	flex: 1;
	margin-top: 1em;
	text-align: center;
	color: var(--gray-500);
	font-size: 0.9em;
`

const Loader = styled(Loading)`
	${Card};
`

const NoResults = styled.div`
	${Card};
`

const ResultsError = styled.div`
	${Card};
`

type CourseSearcherProps = {
	error?: string,
	groupBy: string,
	hasQueried?: boolean,
	inProgress: boolean,
	onCloseSearcher: () => any,
	onGroupByChange: () => any,
	onKeyDown: () => any,
	onQueryChange: () => any,
	onQuerySubmit: () => any,
	onSortChange: () => any,
	partial?: ?Object,
	query: string,
	results: any[],
	sortBy: string,
	studentId?: string,
}

export default function CourseSearcher(props: CourseSearcherProps) {
	const {
		error = '',
		groupBy,
		hasQueried,
		inProgress,
		onCloseSearcher,
		onGroupByChange,
		onKeyDown,
		onQueryChange,
		onQuerySubmit,
		onSortChange,
		partial,
		query,
		results,
		sortBy,
		studentId,
	} = props

	const showNoResults = results.length === 0 && hasQueried
	const showIndicator = inProgress

	let contents = <NoResults>No Results Found</NoResults>

	if (error) {
		contents = <ResultsError>Something broke :-(</ResultsError>
	} else if (showIndicator) {
		contents = <Loader>Searching…</Loader>
	} else if (!showNoResults) {
		contents = (
			<CourseResultsList
				groupBy={groupBy}
				sortBy={sortBy}
				results={results}
				studentId={studentId}
			/>
		)
	}

	let placeholderExtension = ''
	if (partial) {
		const prettyTerm = toPrettyTerm(partial.term)
		placeholderExtension = `(${prettyTerm})`
	}

	return (
		<div className="course-search">
			<header className="sidebar-heading">
				<div className="row">
					<h2>
						Course Search
						<br />
						{placeholderExtension}
					</h2>
					<FlatButton
						className="close-sidebar"
						title="Close Search"
						onClick={onCloseSearcher}
					>
						Close
					</FlatButton>
				</div>

				<div className="row">
					<input
						type="search"
						className="search-box"
						value={query}
						placeholder="Search for a course or phrase"
						onChange={onQueryChange}
						onKeyDown={onKeyDown}
						autoFocus={true}
					/>
				</div>

				<div className="row submit">
					<FlatButton
						className="submit-search-query"
						title="Search"
						onClick={onQuerySubmit}
						disabled={inProgress}
					>
						{inProgress ? (
							<span key="msg">Searching…</span>
						) : (
							<React.Fragment>
								<span>Search </span>
								<Icon>{androidArrowForward}</Icon>
							</React.Fragment>
						)}
					</FlatButton>
				</div>

				{hasQueried && (
					<div className="search-filters">
						<LabelledSelect
							label="Sort by:"
							options={sortByOptions}
							onChange={onSortChange}
							value={sortBy}
						/>

						<LabelledSelect
							label="Group by:"
							options={groupByOptions}
							onChange={onGroupByChange}
							value={groupBy}
						/>
					</div>
				)}
			</header>

			{contents}
		</div>
	)
}
