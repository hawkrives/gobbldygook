import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import {DropTarget} from 'react-dnd'

import itemTypes from '../models/item-types'

import Icon from './icon'

import './course-removal-box.scss'

// Implements the drag source contract.
const removeCourseTarget = {
	drop(props, monitor) {
		const { actions } = props
		const item = monitor.getItem()
		const { clbid, fromScheduleId, isFromSchedule, labid } = item
		if (isFromSchedule) {
			console.log('dropped course', item)
			actions.removeCourse(props.studentId, fromScheduleId, clbid)
			labid && actions.removeCourse(props.studentId, fromScheduleId, labid)
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

class CourseRemovalBox extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
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
