// @flow
import React from 'react'

import map from 'lodash/map'
import {toPrettyTerm} from 'modules/schools/stolaf'

import Button from './button'
import Icon from './icon'
import Loading from './loading'
import CourseResultsList from './course-results-list'
import {androidArrowForward} from '../icons/ionicons'

import {SORT_BY, GROUP_BY} from './course-searcher-options'

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
	partial?: Object,
	query: string,
	results: any[],
	sortBy: string,
	studentId?: string,
};

export default function CourseSearcher(props: CourseSearcherProps) {
	const {
		error='',
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

	let contents = <div className="no-results course-group">No Results Found</div>

	if (error) {
		contents = <div className="error course-group">Something broke :-(</div>
	}

	else if (showIndicator) {
		contents = <div className="loading course-group"><Loading>Searching…</Loading></div>
	}

	else if (!showNoResults) {
		contents = <CourseResultsList
			groupBy={groupBy}
			sortBy={sortBy}
			results={results}
			studentId={studentId}
		/>
	}

	let placeholderExtension = ''
	if (partial) {
		if (partial.year && partial.semester) {
			placeholderExtension = `(${toPrettyTerm(`${partial.year}${partial.semester}`)})`
		}
		else if (partial.year) {
			placeholderExtension = `(${partial.year})`
		}
	}

	return (
		<div className="course-search">
			<header className="sidebar-heading">
				<div className="row">
					<h2>Course Search<br />{placeholderExtension}</h2>
					<Button
						className="close-sidebar"
						title="Close Search"
						type="flat"
						onClick={onCloseSearcher}
					>
						Close
					</Button>
				</div>
				<div className="row">
					<input
						type="search"
						className="search-box"
						value={query}
						placeholder={'Search for a course or phrase'}
						onChange={onQueryChange}
						onKeyDown={onKeyDown}
						autoFocus={true}
					/>
				</div>
				<div className="row submit">
					<Button
						className="submit-search-query"
						title="Search"
						type="flat"
						onClick={onQuerySubmit}
						disabled={inProgress}
					>
						{inProgress
							? [<span key="msg">Searching…</span>]
							: [<span key="msg">Search </span>, <Icon key="icon">{androidArrowForward}</Icon>]}
					</Button>
				</div>
				{hasQueried &&
				<div className="row search-filters">
					<span className="filter">
						<label htmlFor="sort">Sort by:</label><br />
						<select id="sort" value={sortBy} onChange={onSortChange}>
							{map(SORT_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
						</select>
					</span>
					<span className="filter">
						<label htmlFor="group">Group by:</label><br />
						<select id="group" value={groupBy} onChange={onGroupByChange}>
							{map(GROUP_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
						</select>
					</span>
				</div>}
			</header>

			{contents}
		</div>
	)
}
