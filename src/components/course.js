import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import compact from 'lodash/array/compact'
import filter from 'lodash/collection/filter'
import isNull from 'lodash/lang/isNull'
import map from 'lodash/collection/map'

import itemTypes from '../models/item-types'
import Schedule from '../models/schedule'
import Student from '../models/student'

import List from './list'
import DetailedCourse from './detailed-course'
import BasicCourse from './basic-course'

import './course.scss'

// Implements the drag source contract.
const courseSource = {
	beginDrag(props) {
		const scheduleId = props.schedule ? props.schedule.id : null
		return {
			fromSchedule: scheduleId !== null,
			fromSearch: scheduleId === null,
			clbid: props.course.clbid,
			groupid: props.course.groupid,
			fromScheduleID: scheduleId,
		}
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}
}

class Course extends Component {
	static propTypes = {
		conflicts: PropTypes.array,
		connectDragSource: PropTypes.func.isRequired,  // react-dnd
		course: PropTypes.object.isRequired,
		index: PropTypes.number,
		isDragging: PropTypes.bool.isRequired,  // react-dnd
		schedule: PropTypes.instanceOf(Schedule),
		student: PropTypes.instanceOf(Student),
	}

	static defaultProps = {
		conflicts: [],
	}

	constructor() {
		super()
		this.state = {isOpen: false}
	}

	toggleExpanded = () => {
		this.setState({isOpen: !this.state.isOpen})
	}

	render() {
		// console.log('Course#render')
		let InnerCourse = this.state.isOpen
			? DetailedCourse
			: BasicCourse

		let warnings = this.props.conflicts[this.props.index || 0]
		let hasWarnings = compact(warnings).length

		const validWarnings = filter(warnings, w => !isNull(w) && w.warning === true)
		const warningEls = map(validWarnings, (w, index) =>
			<span className={w.className} key={index}>{w.msg}</span>)

		let classSet = cx('course', {
			expanded: this.state.isOpen,
			'has-warnings': hasWarnings,
			'is-dragging': this.props.isDragging,
		})

		return this.props.connectDragSource(
			<article className={classSet}>
				<InnerCourse {...this.props} onClick={this.toggleExpanded}>
					{warningEls.length
						? <List type='inline' className='warnings'>{warningEls}</List>
						: null}
				</InnerCourse>
			</article>
		)
	}
}

export default DragSource(itemTypes.COURSE, courseSource, collect)(Course)
