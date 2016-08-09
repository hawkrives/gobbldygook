import React, {PropTypes} from 'react'
import cx from 'classnames'
import {DropTarget} from 'react-dnd'

import {COURSE} from '../models/item-types'

import Icon from './icon'

import './course-removal-box.css'

function CourseRemovalBox(props) {
	const className = cx('course-removal-box', {
		'can-drop': props.canDrop,
		'is-over': props.isOver,
	})

	return props.connectDropTarget(
		<div className={className}>
			<Icon name='ios-trash-outline' type='block' style={{fontSize: '3em', textAlign: 'center'}} />
			Drop a course here to remove it.
		</div>
	)
}
CourseRemovalBox.propTypes = {
	canDrop: PropTypes.bool.isRequired,  // react-dnd
	connectDropTarget: PropTypes.func.isRequired,  // react-dnd
	isOver: PropTypes.bool.isRequired,  // react-dnd
	removeCourse: PropTypes.func.isRequired,  // studentId is embedded in the passed function
}


// Implements the drag source contract.
const removeCourseTarget = {
	drop(props, monitor) {
		const item = monitor.getItem()
		const { clbid, fromScheduleId, isFromSchedule } = item
		if (isFromSchedule) {
			console.log('dropped course', item)
			// the studentId is embedded in the passed function
			props.removeCourse(fromScheduleId, clbid)
		}
	},
	canDrop(props, monitor) {
		const { isFromSearch } = monitor.getItem()
		if (!isFromSearch) {
			return true
		}
		return false
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

export default DropTarget(COURSE, removeCourseTarget, collect)(CourseRemovalBox)
