'use strict';

import * as React from 'react'
import * as _ from 'lodash'
import {queryCourses} from '../helpers/courses.es6'
import Course from './course.es6'
import semesterName from '../helpers/semesterName.es6'

function toPrettyTerm(term) {
	term = String(term)
	var year = term.substr(0, 4)
	var sem = parseInt(term.substr(4, 1), 10)

	return semesterName(sem) + ' ' + year + '-' + (parseInt(year.substr(2, 2), 10) + 1)
}

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
			.sortBy('deptnum')
			.groupBy('term')
			.value();

		console.log(results)
		var endQueryTime = performance.now()
		console.info('query took ' + (endQueryTime - startQueryTime) + 'ms.')

		var startTime = performance.now()
		let courseObjects = _.map(results, (grouping, key) => {
			return React.createElement('li', {key: key, className: 'course-group'},
				toPrettyTerm(key),
				React.createElement('ul', null,
					_.map(grouping, (course) => {
						return React.createElement('li', {key: course.clbid},
							React.createElement(Course, {info: course})
						)
					})
				)
			)
		})

		var endTime = performance.now()
		console.info('query object creation took an additional ' + (endTime - startTime) + 'ms.')

		this.setState({
			courseObjects: courseObjects.reverse(),
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
