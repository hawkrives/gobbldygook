'use strict';

import * as React from 'react'
import queryCourses from '../helpers/queryCourses'
import Course from './course'
import semesterName from '../helpers/semesterName'

function toPrettyTerm(term) {
	term = String(term)
	var year = term.substr(0, 4)
	var sem = parseInt(term.substr(4, 1), 10)

	return semesterName(sem) + ' ' + year
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
		this.setState({
			open: !this.state.open,
		})
	},
	openSidebar() {
		this.setState({
			open: true,
		})
	},
	closeSidebar() {
		this.setState({
			open: false,
		})
	},
	searchForCourses(event) {
		var time = Date.now()
		var searchQuery = event.target.value

		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.query(searchQuery)
		}, 400)
	},
	query(searchQuery) {
		if (searchQuery.length < 1) {
			return;
		}

		var results = queryCourses(searchQuery);
		let courseObjects = _.map(results, function(grouping, key) {
			return React.createElement('li', {className: 'course-group'}, toPrettyTerm(key),
				React.createElement('ul', null,
					_.map(grouping, function(course) {
						return React.createElement('li', {key: course.clbid}, Course({info: course}))
					})
				)
			)
		})
		this.setState({
			query: searchQuery,
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
					onChange: this.searchForCourses,
					className: 'search-box',
				}),
				React.createElement('ul', {className: 'course-list'}, this.state.courseObjects)
			) : null
		)
	}
})

export default SearchButton
