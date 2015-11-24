import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {DropTarget} from 'react-dnd'

import studentActions from '../flux/student-actions'
import itemTypes from '../models/item-types'

import Icon from './icon'

import './course-removal-box.scss'

// Implements the drag source contract.
const removeCourseTarget = {
	drop(props, monitor) {
		const item = monitor.getItem()
		const {clbid, fromScheduleID, fromSchedule} = item
		if (fromSchedule) {
			console.log('dropped course', item)
			studentActions.removeCourse(props.studentId, fromScheduleID, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		if (!item.fromSearch) {
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
				<Icon name='ios-trash-outline' type='block' style={{fontSize: '3em', textAlign: 'center'}} />
				Drop a course here to remove it.
			</div>
		)
	}
}

export default DropTarget(itemTypes.COURSE, removeCourseTarget, collect)(CourseRemovalBox)
