import React, {PropTypes} from 'react'
import cx from 'classnames'
import {DropTarget} from 'react-dnd'
import debug from 'debug'
const log = debug('web:courses')

import {IDENT_COURSE} from 'modules/core'

import Icon from './icon'
import {iosTrashOutline} from '../icons/ionicons'

import './course-removal-box.scss'

function CourseRemovalBox(props) {
	const className = cx('course-removal-box', {
		'can-drop': props.canDrop,
		'is-over': props.isOver,
	})

	return props.connectDropTarget(
		<div className={className}>
			<Icon type='block' style={{fontSize: '3em', textAlign: 'center'}}>{iosTrashOutline}</Icon>
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
			log('dropped course', item)
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

export default DropTarget(IDENT_COURSE, removeCourseTarget, collect)(CourseRemovalBox)
