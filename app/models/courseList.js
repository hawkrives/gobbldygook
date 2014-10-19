'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import DraggableContainerMixin from '../mixins/draggableContainer'
import Course from './course'

var CourseList = React.createClass({
	mixins: [DraggableContainerMixin],
	render() {
		var courseElements = _.map(this.props.courses,
			(course) => Course({key: course.clbid, info: course}))

		// console.log('courses', courseElements)

		return React.DOM.div({className: 'course-list'},
			courseElements
		)
	}
})

export default CourseList
