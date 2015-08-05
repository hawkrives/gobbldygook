import React, {PropTypes, findDOMNode} from 'react'
import cx from 'classnames'
import {State} from 'react-router'

import flatten from 'lodash/array/flatten'
import groupBy from 'lodash/collection/groupBy'
import isObject from 'lodash/lang/isObject'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import sortBy from 'lodash/collection/sortBy'
import sortByAll from 'lodash/collection/sortByAll'
import present from 'present'
import {toPrettyTerm} from 'sto-helpers'
import queryCourseDatabase from '../lib/query-course-database'

import Button from '../components/button'
import Course from '../components/course'
import Icon from '../components/icon'
import Loading from '../components/loading'

import stickyfill from '../lib/init-stickyfill'

let CourseSearcher = React.createClass({
	propTypes: {
		isHidden: PropTypes.bool,
		toggle: PropTypes.func.isRequired,
	},

	mixins: [State],

	getInitialState() {
		return {
			isQuerying: false,
			hasQueried: false,
			results: [],
			queryString: '',
			queryInProgress: false,
		}
	},

	componentDidMount() {
		stickyfill.add(findDOMNode(this))
	},

	componentWillUnmount() {
		stickyfill.remove(findDOMNode(this))
	},

	onSubmit() {
		if (this.state.queryString !== this.state.lastQuery) {
			this.query(this.state.queryString)
		}
	},

	onChange(evt) {
		this.setState({queryString: evt.target.value})
	},

	onKeyDown(evt) {
		if (evt.keyCode === 13) {
			this.onSubmit()
		}
	},

	processQueryResults([results, startQueryTime]=[]) {
		console.log('results', results)

		// Sort the results
		const sortedByIdent = sortByAll(results, ['deptnum', 'sect'])
		// Group them by term, then turn the object into an array of pairs
		const groupedAndPaired = pairs(groupBy(sortedByIdent, 'term'))
		// Sort the result arrays by the first element, the term, because
		// object keys don't have an implicit sort. Also reverse it, so the
		// most recent is at the top.
		const sortedByTerm = sortBy(groupedAndPaired, group => group[0]).reverse()
		// flatten once, to merge the [date, courses] arrays,
		// then flatten once more, to raise the courses into the array
		const searchResults = flatten(flatten(sortedByTerm))

		console.log('search results', searchResults)
		let endQueryTime = present()
		console.info(`query took ${(endQueryTime - startQueryTime)}ms.`)

		this.setState({results: searchResults, hasQueried: true, queryInProgress: false})
	},

	query(searchQuery) {
		if (searchQuery.length === 0 || this.state.queryInProgress) {
			return
		}

		this.setState({results: [], hasQueried: false})
		let startQueryTime = present()

		queryCourseDatabase(searchQuery)
			.then(results => [results, startQueryTime])
			.then(this.processQueryResults)
			.catch(err => console.error(err))

		this.setState({queryInProgress: true, lastQuery: searchQuery})
	},

	render() {
		// console.log('SearchButton#render')
		let showNoResults = this.state.results.length === 0 && this.state.hasQueried
		let showIndicator = this.state.queryInProgress

		let contents = <li className='no-results'>No Results Found</li>

		if (showIndicator) {
			contents = <li className='loading'><Loading>Searching…</Loading></li>
		}

		else if (!showNoResults) {
			contents = map(this.state.results, (courseOrTerm, index) =>
				isObject(courseOrTerm)  // is it a course or a term?
					? <li key={index}><Course info={courseOrTerm} /></li>
					: <li key={index} className='course-group'>{toPrettyTerm(courseOrTerm)}</li>)
		}

		return (
			<div className={cx('search-sidebar', {'is-hidden': this.props.isHidden})}>
				<header className='sidebar-heading'>
					<h1>Search for Courses</h1>
					<Button
						className='close-sidebar'
						title='Close Sidebar'
						type='flat'
						onClick={this.props.toggle}>
						<Icon name='ionicon-close' />
					</Button>
				</header>

				<input type='search' className='search-box'
					placeholder='Search Courses'
					defaultValue={this.state.query}
					onChange={this.onChange}
					onKeyDown={this.onKeyDown}
					autoFocus={true} />

				<ul className='course-list'>
					{contents}
				</ul>
			</div>
		)
	},
})

export default CourseSearcher
