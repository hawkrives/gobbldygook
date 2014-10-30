'use strict';

import * as React from 'react'
import queryCourses from '../helpers/queryCourses'
import Course from './course'

var SearchButton = React.createClass({
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
		var results = queryCourses(event.target.value);
		let courseObjects = _.map(results, (course) => React.DOM.li({key: course.clbid}, Course({info: course})))
		this.setState({
			query: event.target.value,
			courseObjects: courseObjects,
		})
	},
	render() {
		return React.DOM.div(null,
			React.DOM.button({className: 'search-button', onClick: this.toggleSidebar}),
			this.state.open ? React.DOM.div({className: 'search-sidebar'},
				React.DOM.header({className: 'sidebar-heading'},
					React.DOM.h1(null, 'Search for Courses'),
					React.DOM.button({className: 'close-sidebar', onClick: this.closeSidebar, title: 'Close Sidebar'})),
				React.DOM.input({
					type: 'search',
					placeholder: 'Search Course Titles',
					defaultValue: this.state.query,
					onChange: this.searchForCourses,
					className: 'search-box',
				}),
				React.DOM.ul({className: 'course-list'}, this.state.courseObjects)
			) : null
		)
	}
})

export default SearchButton
