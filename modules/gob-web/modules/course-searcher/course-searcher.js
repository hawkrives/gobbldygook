// @flow
import React from 'react'

import map from 'lodash/map'
import uniqueId from 'lodash/uniqueId'
import {toPrettyTerm} from '@gob/school-st-olaf-college'

import Button from '../../components/button'
import Icon from '../../components/icon'
import Loading from '../../components/loading'
import CourseResultsList from './course-results-list'
import {androidArrowForward} from '../../icons/ionicons'

import {SORT_BY, GROUP_BY} from './course-searcher-options'

import styled from 'styled-components'

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
}

let Label = styled.label`
	display: block;

	font-size: 0.9em;
	font-weight: 500;
`

let FullWidthSelect = styled.select`
	width: 100%;
`

const LabelledSelect = ({className, onChange, value, label, options}: {
	onChange: (ev: SyntheticInputEvent<HTMLSelectElement>) => void,
	value: string,
	label: string,
	options: Array<string>,
	className: string,
}) => {
	let id = `labelled-select-${uniqueId()}`

	return (
		<span className={className}>
			<Label htmlFor={id}>{label}</Label>

			<FullWidthSelect
				id={id}
				value={value}
				onChange={onChange}
			>
				{options.map(opt => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</FullWidthSelect>
		</span>
	)
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

	let contents = (
		<div className="no-results course-group">No Results Found</div>
	)

	if (error) {
		contents = <div className="error course-group">Something broke :-(</div>
	} else if (showIndicator) {
		contents = (
			<div className="loading course-group">
				<Loading>Searching…</Loading>
			</div>
		)
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
		if (partial.year && partial.semester) {
			const prettyTerm = toPrettyTerm(
				`${partial.year}${partial.semester}`,
			)
			placeholderExtension = `(${prettyTerm})`
		} else if (partial.year) {
			placeholderExtension = `(${partial.year})`
		}
	}

	return (
		<div className="course-search">
			<header className="sidebar-heading">
				<div className="row">
					<h2>
						Course Search<br />
						{placeholderExtension}
					</h2>
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
							: [
									<span key="msg">Search </span>,
									<Icon key="icon">
										{androidArrowForward}
									</Icon>,
							  ]}
					</Button>
				</div>

				{hasQueried && (
					<div className="row search-filters">
						<LabelledSelect
							className="filter"
							label="Sort by:"
							options={((Object.values(SORT_BY): Array<any>): Array<string>)}
							onChange={onSortChange}
							value={sortBy}
						/>

						<LabelledSelect
							className="filter"
							label="Group by:"
							options={((Object.values(GROUP_BY): Array<any>): Array<string>)}
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
