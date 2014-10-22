'use strict';

import * as _ from 'lodash'
import * as React from 'react'

import Course from './course'

import {DragDropMixin} from '../../node_modules/react-dnd/dist/ReactDND.min'
import itemTypes from '../objects/itemTypes'

var CourseList = React.createClass({
	mixins: [DragDropMixin],
	
	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dropTarget: {
				acceptDrop(clbid) {
					console.log('dropped clbid', clbid)
				}
			}
		})
	},
	
	render() {
		// console.log('courses', courseElements)

		return React.DOM.div(
			Object.assign({className: 'course-list'}, this.dropTargetFor(itemTypes.COURSE)),
			_.map(this.props.courses,
				course => Course({key: course.clbid, info: course}))
		)
	}
})

export default CourseList
