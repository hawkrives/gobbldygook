'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Course from './course'

var CourseList = React.createClass({
	render() {
		// console.log('courses', courseElements)

		return React.DOM.div({className: 'course-list'},
			_.map(this.props.courses,
				course => Course({key: course.clbid, info: course}))
		)
	}
})

export default CourseList
