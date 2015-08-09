import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {DropTarget} from 'react-dnd'

import studentActions from '../flux/student-actions'
import itemTypes from '../models/item-types'

import Icon from './icon'

// Implements the drag source contract.
const removeCourseTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		const {clbid, fromScheduleID} = item
		if (fromScheduleID) {
			console.log('dropped course', item)
			studentActions.removeCourse(props.studentId, fromScheduleID, clbid)
		}
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}
}

class CourseRemovalBox extends Component {
	static propTypes = {
		canDrop: PropTypes.bool.isRequired,  // react-dnd
		connectDropTarget: PropTypes.func.isRequired,  // react-dnd
		isOver: PropTypes.bool.isRequired,  // react-dnd
		studentId: PropTypes.string.isRequired,
	}

	render() {
		const className = cx('course-removal-box', {
			'can-drop': this.props.canDrop,
			'is-over': this.props.isOver,
		})

		return this.props.connectDropTarget(
			<div className={className}>
				Drop a course here to remove it.
			</div>
		)
	}
}

export default DropTarget(itemTypes.COURSE, removeCourseTarget, collect)(CourseRemovalBox)
