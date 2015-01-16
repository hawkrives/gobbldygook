import React from 'react'
import _ from 'lodash'
import stickyfill from '../helpers/initStickyfill'

import toPrettyTerm from 'sto-helpers/lib/toPrettyTerm'
import {queryCourseDatabase} from '../helpers/courses'

import Course from './course'

let SearchButton = React.createClass({
	getInitialState() {
		return {
			open: false,
			courseObjects: null,
			query: '',
		}
	},

	componentDidMount() {
		stickyfill.add(this.getDOMNode())
	},
	componentWillUnmount() {
		stickyfill.remove(this.getDOMNode())
	},

	toggleSidebar() {
		this.setState({open: !this.state.open})
	},
	openSidebar() {
		this.setState({open: true})
	},
	closeSidebar() {
		this.setState({open: false})
	},
	onSubmit: function() {
		this.query(this.state.query)
	},
	onChange: function(evt) {
		this.setState({query: evt.target.value})
	},
	onKeyDown: function(evt) {
		if (evt.keyCode == 13) {
			return this.onSubmit()
		}
	},

	query(searchQuery) {
		let startQueryTime = performance.now()
		queryCourseDatabase(searchQuery).then(results => {
			console.log('results', results)

			let searchResults = _(results)
				.sortBy(c => `${c.deptnum}${c.sect || ''}`) // Sort the results
				.groupBy('term') // Group them by term
				.pairs() // Turn the object into an array of pairs
				// Sort the result arrays by the first element, the term,
				// because object keys don't have an implicit sort.
				.sortBy(group => group[0])
				.reverse() // reverse it, so the most recent is at the top
				.flatten() // then flatten so that it's all one flat list
				.value()

			console.log('search results', searchResults)
			let endQueryTime = performance.now()
			console.info('query took ' + (endQueryTime - startQueryTime) + 'ms.')

			let startTime = performance.now()
			let courseObjects = _.map(searchResults, (courseOrTerm) => {
				if (!(_.isObject(courseOrTerm))) {
					let prettyTerm = toPrettyTerm(courseOrTerm)
					return React.createElement('li',
						{key: prettyTerm, className: 'course-group'},
						prettyTerm)
				}
				return React.createElement('li',
					{key: courseOrTerm.clbid},
					React.createElement(Course, {info: courseOrTerm}))
			})

			let endTime = performance.now()
			console.info('react element creation took an additional ' + (endTime - startTime) + 'ms.')

			this.setState({courseObjects})
		})
	},

	render() {
		return React.createElement('div', {className: 'search-sidebar'},
			React.createElement('header', {className: 'sidebar-heading'},
				React.createElement('h1', null, 'Search for Courses'),
				React.createElement('button', {className: 'close-sidebar', onClick: this.closeSidebar, title: 'Close Sidebar'})),
			React.createElement('input', {
				type: 'search',
				placeholder: 'Search Courses',
				defaultValue: this.state.query,
				onChange: this.onChange,
				onKeyDown: this.onKeyDown,
				className: 'search-box',
				autoFocus: true,
			}),
			React.createElement('ul', {className: 'course-list'}, this.state.courseObjects)
		)
	},
})

export default SearchButton
