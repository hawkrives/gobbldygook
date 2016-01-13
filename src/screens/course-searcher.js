import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import {ga} from '../start/analytics'
import compareProps from '../helpers/compare-props'
import groupBy from 'lodash/collection/groupBy'
import includes from 'lodash/collection/includes'
import uniq from 'lodash/array/uniq'
import flatten from 'lodash/array/flatten'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import sortBy from 'lodash/collection/sortBy'
import sortByAll from 'lodash/collection/sortByAll'
import present from 'present'
import toPrettyTerm from '../helpers/to-pretty-term'
import {oxford} from 'humanize-plus'
import buildDept from '../helpers/build-dept'
import semesterName from '../helpers/semester-name'
import expandYear from '../helpers/expand-year'
import queryCourseDatabase from '../helpers/query-course-database'

import Button from '../components/button'
import Course from '../components/course'
import Icon from '../components/icon'
import Loading from '../components/loading'

import to12Hour from '../helpers/to-12-hour-time'

import './course-searcher.scss'

const SORT_BY = [
	'Year',
	'Title',
	'Department',
	'Day of Week',
	'Time of Day',
]

const GROUP_BY = [
	'Day of Week',
	'Department',
	'GenEd',
	'Semester',
	'Term',
	'Time of Day',
	'Year',
	'None',
]

const REVERSE_ORDER = ['Year', 'Term', 'Semester']

const DAY_OF_WEEK = course => course.offerings
	? map(course.offerings, offer => offer.day).join('/')
	: 'No Days Listed'

const TIME_OF_DAY = course => course.offerings
	? oxford(sortBy(uniq(flatten(map(course.offerings, offer =>
		map(offer.times, time => `${to12Hour(time.start)}-${to12Hour(time.end)}`))))))
	: 'No Times Listed'

const DEPARTMENT = course => course.depts ? buildDept(course) : 'No Department'

const GEREQ = course => course.gereqs ? oxford(course.gereqs) : 'No GEs'

const GROUP_BY_TO_KEY = {
	'Day of Week': DAY_OF_WEEK,
	'Department': DEPARTMENT,
	'GenEd': GEREQ,
	'Semester': 'semester',
	'Term': 'term',
	'Time of Day': TIME_OF_DAY,
	'Year': 'year',
	'None': false,
}

const GROUP_BY_TO_TITLE = {
	'Day of Week': days => days,
	'Department': depts => depts,
	'GenEd': gereqs => gereqs,
	'Semester': sem => semesterName(sem),
	'Term': term => toPrettyTerm(term),
	'Time of Day': times => times,
	'Year': year => expandYear(year),
	'None': () => '',
}

const SORT_BY_TO_KEY = {
	'Year': 'year',
	'Title': 'title',
	'Department': course => course.depts ? buildDept(course) : 'No Department',
	'Day of Week': DAY_OF_WEEK,
	'Time of Day': TIME_OF_DAY,
}

function getPartialSearch(location) {
	try {
		return JSON.parse(location.query.partialSearch)
	}
	catch (err) {
		return {}
	}
}

class CourseResultsList extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		groupBy: PropTypes.oneOf(GROUP_BY).isRequired,
		results: PropTypes.array.isRequired,
		sortBy: PropTypes.oneOf(SORT_BY).isRequired,
		student: PropTypes.object,
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		// console.log('CourseResultsList.render')
		const {
			actions,
			groupBy: groupByValue,
			results,
			sortBy: sortByValue,
			student,
		} = this.props

		// TODO: Speed this up! This preperation stuff takes ~230ms by itself, with enough courses
		// rendered. (like, say, {year: 2012})
		const sorted = sortBy(results, SORT_BY_TO_KEY[sortByValue])

		// Group them by term, then turn the object into an array of pairs.
		const groupedAndPaired = pairs(groupBy(sorted, GROUP_BY_TO_KEY[groupByValue]))

		// Sort the result arrays by the first element, the term, because
		// object keys don't have an implicit sort.
		const searchResults = sortBy(groupedAndPaired, group => group[0])

		if (includes(REVERSE_ORDER, groupByValue)) {
			// Also reverse it, so the most recent is at the top.
			searchResults.reverse()
		}

		return (
			<ul className='term-list'>
				{map(searchResults, ([groupTitle, courses]) => {
					const title = GROUP_BY_TO_TITLE[groupByValue](groupTitle)
					return <li key={groupTitle} className='course-group'>
						{title && <p className='course-group-title'>{title}</p>}
						<ul className='course-list'>
							{map(courses, (course, index) =>
								<li key={index}>
									<Course
										course={course}
										student={student}
										actions={actions}
									/>
								</li>)}
						</ul>
					</li>
				})}
			</ul>
		)
	}
}

class CourseSearcher extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		groupBy: PropTypes.oneOf(GROUP_BY).isRequired,
		hasQueried: PropTypes.bool,
		isHidden: PropTypes.bool,
		onCloseSearcher: PropTypes.func.isRequired,
		onGroupByChange: PropTypes.func.isRequired,
		onKeyDown: PropTypes.func.isRequired,
		onQueryChange: PropTypes.func.isRequired,
		onQuerySubmit: PropTypes.func.isRequired,
		onSortChange: PropTypes.func.isRequired,
		partialQuery: PropTypes.object.isRequired,
		queryError: PropTypes.string,
		queryInProgress: PropTypes.bool.isRequired,
		queryString: PropTypes.string.isRequired,
		results: PropTypes.array.isRequired,
		sortBy: PropTypes.oneOf(SORT_BY).isRequired,
		student: PropTypes.object,
	};

	static defaultProps = {
		queryError: '',
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		const {
			actions,
			groupBy,
			hasQueried,
			isHidden,
			onCloseSearcher,
			onKeyDown,
			onQueryChange,
			onQuerySubmit,
			onSortChange,
			onGroupByChange,
			queryInProgress,
			queryString,
			partialQuery,
			results,
			queryError,
			sortBy,
			student,
		} = this.props

		const showNoResults = results.length === 0 && hasQueried
		const showIndicator = queryInProgress

		let contents = <div className='no-results course-group'>No Results Found</div>

		if (queryError) {
			contents = <div className='error course-group'>Something broke :-(</div>
		}

		else if (showIndicator) {
			contents = <div className='loading course-group'><Loading>Searching…</Loading></div>
		}

		else if (!showNoResults) {
			contents = <CourseResultsList
				actions={actions}
				student={student}
				groupBy={groupBy}
				sortBy={sortBy}
				results={results}
			/>
		}

		let placeholderExtension = partialQuery.term
			? `(${toPrettyTerm(partialQuery.term)})`
			: ''

		return (
			<div className={cx('search-sidebar', isHidden && 'is-hidden')}>
				<header className='sidebar-heading'>
					<div className='row'>
						<h2>Course Search<br/>{placeholderExtension}</h2>
						<Button
							className='close-sidebar'
							title='Close Search'
							type='flat'
							onClick={onCloseSearcher}
						>
							Close
						</Button>
					</div>
					<div className='row'>
						<input
							type='search'
							className='search-box'
							value={queryString}
							placeholder={'Search for a course or phrase'}
							onChange={onQueryChange}
							onKeyDown={onKeyDown}
							autoFocus={true}
						/>
					</div>
					<div className='row submit'>
						<Button
							className='submit-search-query'
							title='Search'
							type='flat'
							onClick={onQuerySubmit}
							disabled={queryInProgress}
						>
							{queryInProgress
								? [<span key='msg'>Searching…</span>]
								: [<span key='msg'>Search </span>, <Icon key='icon' name='android-arrow-forward' />]}
						</Button>
					</div>
					{hasQueried &&
					<div className='row search-filters'>
						<span className='filter'>
							<label htmlFor='sort'>Sort by:</label><br/>
							<select id='sort' value={sortBy} onChange={onSortChange}>
								{map(SORT_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
						<span className='filter'>
							<label htmlFor='group'>Group by:</label><br/>
							<select id='group' value={groupBy} onChange={onGroupByChange}>
								{map(GROUP_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
					</div>}
				</header>

				{contents}
			</div>
		)
	}
}

export default class CourseSearcherContainer extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		closeSearcher: PropTypes.func.isRequired,
		isHidden: PropTypes.bool,
		student: PropTypes.object,
	};

	static contextTypes = {
		location: React.PropTypes.object,
	};

	constructor() {
		super()
		this.state = {
			error: '',
			isQuerying: false,
			hasQueried: false,
			results: [],
			queryString: '',
			lastQuery: '',
			queryInProgress: false,
			sortBy: SORT_BY[0],
			groupBy: GROUP_BY[4],
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props !== nextProps) || (this.state !== nextState)
	}

	onQuerySubmit = () => {
		if (this.state.queryString !== this.state.lastQuery || getPartialSearch(this.context.location)) {
			ga('send', 'event', 'search_query', 'submit', this.state.queryString, 1)
			this.query(this.state.queryString)
		}
	};

	onQueryChange = ev => {
		this.setState({queryString: ev.target.value})
	};

	onKeyDown = ev => {
		if (ev.keyCode === 13) {
			this.onQuerySubmit()
		}
	};

	onSortChange = ev => {
		this.setState({sortBy: ev.target.value})
	};

	onGroupByChange = ev => {
		this.setState({groupBy: ev.target.value})
	};

	query = searchQuery => {
		if ((searchQuery.length === 0 && !getPartialSearch(this.context.location)) || this.state.queryInProgress) {
			return
		}

		this.setState({results: [], hasQueried: false, error: null})
		const startQueryTime = present()

		let partial = getPartialSearch(this.context.location)

		queryCourseDatabase(searchQuery, partial)
			.then(results => {
				console.info(`query took ${(present() - startQueryTime)}ms.`)
				console.log('results', results)

				// Run an intial sort on the results.
				const sortedByIdentifier = sortByAll(results, ['year', 'deptnum', 'semester', 'section'])

				this.setState({
					results: sortedByIdentifier,
					hasQueried: true,
					queryInProgress: false,
				})

				return null
			})
			.catch(err => {
				console.log('error!')
				console.error(err)
				this.setState({queryInProgress: false, hasQueried: false, error: err})
			})

		this.setState({queryInProgress: true, lastQuery: searchQuery})
	};

	render() {
		let partialQuery = getPartialSearch(this.context.location)

		return (
			<CourseSearcher
				actions={this.props.actions}
				groupBy={this.state.groupBy}
				hasQueried={this.state.hasQueried}
				isHidden={this.props.isHidden}
				onCloseSearcher={this.props.closeSearcher}
				onGroupByChange={this.onGroupByChange}
				onKeyDown={this.onKeyDown}
				onQueryChange={this.onQueryChange}
				onQuerySubmit={this.onQuerySubmit}
				onSortChange={this.onSortChange}
				partialQuery={partialQuery}
				queryError={this.state.error}
				queryInProgress={this.state.queryInProgress}
				queryString={this.state.queryString}
				results={this.state.results}
				sortBy={this.state.sortBy}
				student={this.props.student}
			/>
		)
	}
}
