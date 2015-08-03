import React from 'react'
import {State} from 'react-router'
import flatten from 'lodash/array/flatten'
import groupBy from 'lodash/collection/groupBy'
import isObject from 'lodash/lang/isObject'
import map from 'lodash/collection/map'
import pairs from 'lodash/object/pairs'
import sortBy from 'lodash/collection/sortBy'
import sortByAll from 'lodash/collection/sortByAll'
import present from 'present'
import cx from 'classnames'

import {toPrettyTerm} from 'sto-helpers'
import queryCourseDatabase from '../helpers/queryCourseDatabase'
import Course from './course'
import stickyfill from '../helpers/initStickyfill'

let SearchButton = React.createClass({
	propTypes: {
		isHidden: React.PropTypes.bool,
		toggle: React.PropTypes.func.isRequired,
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
		stickyfill.add(React.findDOMNode(this))
	},

	componentWillUnmount() {
		stickyfill.remove(React.findDOMNode(this))
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

		let startTime = present()
		let courseObjects = map(searchResults, (courseOrTerm, index) => {
			if (!isObject(courseOrTerm)) {
				let prettyTerm = toPrettyTerm(courseOrTerm)

				return <li key={prettyTerm} className='course-group'>{prettyTerm}</li>
			}
			return <li key={courseOrTerm.clbid}><Course info={courseOrTerm} index={index} /></li>
		})

		let endTime = present()
		console.info(`element creation took an additional ${(endTime - startTime)}ms.`)

		this.setState({results: courseObjects, hasQueried: true, queryInProgress: false})
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
			.done()

		this.setState({queryInProgress: true, lastQuery: searchQuery})
	},

	render() {
		// console.log('SearchButton#render')
		let showNoResults = this.state.results.length === 0 && this.state.hasQueried
		let showIndicator = this.state.queryInProgress

		let loadingIndicator = (<li className='loading'>
			<div className='loading-spinner'><div /></div>
		</li>)

		let contents = null
		if (!showIndicator) {
			contents = showNoResults ?
				<li className='no-results'>No Results Found</li> :
				this.state.results
		}

		return (<div className={cx('search-sidebar', {'is-hidden': this.props.isHidden})}>
			<header className='sidebar-heading'>
				<h1>Search for Courses</h1>
				<button
					className='close-sidebar'
					title='Close Sidebar'
					onClick={this.props.toggle} />
			</header>

			<input type='search' className='search-box'
				placeholder='Search Courses'
				defaultValue={this.state.query}
				onChange={this.onChange}
				onKeyDown={this.onKeyDown}
				autoFocus={true} />

			<ul className='course-list'>
				{showIndicator ? loadingIndicator : contents}
			</ul>
		</div>)
	},
})

export default SearchButton
