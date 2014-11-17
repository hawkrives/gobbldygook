'use strict';

import * as React from 'react'
import * as _ from 'lodash'
import {queryCourses} from '../helpers/courses.es6'
import Course from './course.es6'
import {toPrettyTerm} from '../helpers/semesterName.es6'

var SearchButton = React.createClass({
	displayName: 'SearchButton',
	getInitialState() {
		return {
			open: false,
			courseObjects: null,
			query: '',
		}
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
		this.setState({query: evt.target.value});
	},
	onKeyDown: function(evt) {
		if (evt.keyCode == 13) {
			return this.onSubmit();
		}
	},
	query(searchQuery) {
		var startQueryTime = performance.now()
		var results = _(queryCourses(searchQuery))
			.sortBy('deptnum') // Sort the results
			.groupBy('term') // Group them by term
			.pairs() // Turn the object into an array of pairs
			.reverse() // reverse it, so the most recent is at the top
			.flatten() // then flatten so that it's all one flat list
			.value();

		console.log('search results', results)
		var endQueryTime = performance.now()
		console.info('query took ' + (endQueryTime - startQueryTime) + 'ms.')

		var startTime = performance.now()
		let courseObjects = _.map(results, (courseOrTerm) => {
			if (!(_.isObject(courseOrTerm))) {
				return React.createElement('li',
					{key: toPrettyTerm(courseOrTerm), className: 'course-group'},
					toPrettyTerm(courseOrTerm))
			}
			return React.createElement('li',
				{key: courseOrTerm.clbid},
				React.createElement(Course, {info: courseOrTerm}))
		})

		var endTime = performance.now()
		console.info('react element creation took an additional ' + (endTime - startTime) + 'ms.')

		this.setState({
			courseObjects: courseObjects,
		})
	},
	render() {
		return React.createElement('div', null,
			React.createElement('button', {className: 'search-button', onClick: this.toggleSidebar}),
			this.state.open ? React.createElement('div', {className: 'search-sidebar'},
				React.createElement('header', {className: 'sidebar-heading'},
					React.createElement('h1', null, 'Search for Courses'),
					React.createElement('button', {className: 'close-sidebar', onClick: this.closeSidebar, title: 'Close Sidebar'})),
				React.createElement('input', {
					type: 'search',
					placeholder: 'Search Course Titles',
					defaultValue: this.state.query,
					onChange: this.onChange,
					onKeyDown: this.onKeyDown,
					className: 'search-box',
					autoFocus: true,
				}),
				React.createElement('ul', {className: 'course-list'}, this.state.courseObjects)
			) : null
		)
	}
})

export default SearchButton
