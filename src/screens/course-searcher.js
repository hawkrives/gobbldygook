import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

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
import size from 'lodash/collection/size'

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

const DEPARTMENT =  course => course.depts ? buildDept(course) : 'No Department'

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

export default class CourseSearcher extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		closeSearchSidebar: PropTypes.func.isRequired,
		isHidden: PropTypes.bool,
		student: PropTypes.object.isRequired,
	}

	static contextTypes = {
		location: React.PropTypes.object,
	}

	constructor() {
		super()
		this.state = {
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

	onSubmit = () => {
		if (this.state.queryString !== this.state.lastQuery || this.context.location.query.partialSearch) {
			if (process.env.NODE_ENV === 'production') {
				try {
					window.ga('send', 'event', 'search_query', 'submit', this.state.queryString, 1)
				}
				catch (e) {} // eslint-disable-line no-empty
			}
			this.query(this.state.queryString)
		}
	}

	onChange = evt => {
		this.setState({queryString: evt.target.value})
	}

	onKeyDown = evt => {
		if (evt.keyCode === 13) {
			this.onSubmit()
		}
	}

	query = searchQuery => {
		if ((searchQuery.length === 0 && !this.context.location.query.partialSearch) || this.state.queryInProgress) {
			return
		}

		this.setState({results: [], hasQueried: false, error: null})
		const startQueryTime = present()

		queryCourseDatabase(searchQuery, JSON.parse(this.context.location.query.partialSearch))
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
	}

	render() {
		// console.log('SearchButton#render')
		// TODO: Speed this up! This preperation stuff takes ~230ms by itself, with enough courses
		// rendered. (like, say, {year: 2012})
		console.time('render')
		const showNoResults = this.state.results.length === 0 && this.state.hasQueried
		const showIndicator = this.state.queryInProgress

		let contents = <li className='no-results course-group'>No Results Found</li>

		if (this.state.error) {
			contents = <li className='error course-group'>Something broke :-(</li>
		}

		else if (showIndicator) {
			contents = <li className='loading course-group'><Loading>Searching…</Loading></li>
		}

		else if (!showNoResults) {
			const sorted = sortBy(this.state.results, SORT_BY_TO_KEY[this.state.sortBy])

			// Group them by term, then turn the object into an array of pairs.
			const groupedAndPaired = pairs(groupBy(sorted, GROUP_BY_TO_KEY[this.state.groupBy]))

			// Sort the result arrays by the first element, the term, because
			// object keys don't have an implicit sort.
			const searchResults = sortBy(groupedAndPaired, group => group[0])

			if (includes(REVERSE_ORDER, this.state.groupBy)) {
				// Also reverse it, so the most recent is at the top.
				searchResults.reverse()
			}

			contents = map(searchResults, ([groupTitle, courses]) =>
				<li key={groupTitle} className='course-group'>
					{GROUP_BY_TO_TITLE[this.state.groupBy](groupTitle) && <p className='course-group-title'>{GROUP_BY_TO_TITLE[this.state.groupBy](groupTitle)}</p>}
					<ul className='course-list'>
						{map(courses, (course, index) =>
							<li key={index}><Course course={course} student={this.props.student} actions={this.props.actions} /></li>)}
							{/*<li key={index}>{JSON.stringify(course, null, 2)}</li>)}*/}
					</ul>
				</li>
			)
		}

		let placeholderExtension = ''
		if (size(this.context.location.query.partialSearch)) {
			placeholderExtension = `(${toPrettyTerm(JSON.parse(this.context.location.query.partialSearch).term)})`
		}
		console.timeEnd('render')

		return (
			<div className={cx('search-sidebar', this.props.isHidden && 'is-hidden')}>
				<header className='sidebar-heading'>
					<div className='row'>
						<h2>Course Search<br/>{placeholderExtension}</h2>
						<Button
							className='close-sidebar'
							title='Close Sidebar'
							type='flat'
							onClick={this.props.closeSearchSidebar}
						>
							Close
						</Button>
					</div>
					<div className='row'>
						<input
							type='search'
							className='search-box'
							value={this.state.query}
							placeholder={'Search for a course or phrase'}
							onChange={this.onChange}
							onKeyDown={this.onKeyDown}
							autoFocus={true}
							ref='searchbox'
						/>
						<Button
							className='submit-search-query'
							title='Search'
							type='flat'
							onClick={this.onSubmit}>
							<Icon name='android-arrow-forward' />
						</Button>
					</div>
					{this.state.hasQueried &&
					<div className='row search-filters'>
						<span className='filter'>
							<label htmlFor='sort'>Sort by:</label><br/>
							<select id='sort' value={this.state.sortBy} onChange={ev => this.setState({sortBy: ev.target.value})}>
								{map(SORT_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
						<span className='filter'>
							<label htmlFor='group'>Group by:</label><br/>
							<select id='group' value={this.state.groupBy} onChange={ev => this.setState({groupBy: ev.target.value})}>
								{map(GROUP_BY, opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
						</span>
					</div>}
				</header>

				<ul className='term-list'>
					{contents}
				</ul>
			</div>
		)
	}
}
