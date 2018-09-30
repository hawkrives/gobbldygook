// @flow
import React from 'react'

import {toPrettyTerm} from '@gob/school-st-olaf-college'
import {Card} from '../../components/card'
import {LabelledSelect} from './labelled-select'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import Loading from '../../components/loading'
import CourseResultsList from './course-results-list'
import {androidArrowForward} from '../../icons/ionicons'

import {sortByOptions, groupByOptions} from './course-searcher-options'

import './course-searcher.scss'

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
	let {
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

	return (
		<>
			<Card as="header" className="sidebar-heading">
				<h2>
					Course Search
					{partial && (
						<>
							<br />
							({toPrettyTerm(partial.term)})
						</>
					)}
				</h2>
				<FlatButton
					className="close-sidebar"
					title="Close Search"
					onClick={onCloseSearcher}
				>
					Close
				</FlatButton>

				<input
					type="search"
					className="search-box"
					value={query}
					placeholder="Search for a course or phrase"
					onChange={onQueryChange}
					onKeyDown={onKeyDown}
					autoFocus={true}
				/>

				<FlatButton
					className="submit-search-query"
					title="Search"
					onClick={onQuerySubmit}
					disabled={inProgress}
				>
					{inProgress ? (
						<span key="msg">Searching…</span>
					) : (
						<>
							<span>Search </span>
							<Icon>{androidArrowForward}</Icon>
						</>
					)}
				</FlatButton>
			</Card>

			{hasQueried && (
				<Card className="search-filters">
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
				</Card>
			)}

			{error ? (
				<Card>Something broke :-(</Card>
			) : inProgress ? (
				<Card>
					<Loading>Searching…</Loading>
				</Card>
			) : results.length ? (
				<CourseResultsList
					groupBy={groupBy}
					sortBy={sortBy}
					results={results}
					studentId={studentId}
				/>
			) : results.length === 0 && hasQueried ? (
				<Card>No Results Found</Card>
			) : null}
		</>
	)
}
