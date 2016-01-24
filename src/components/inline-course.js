import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import isNull from 'lodash/isNull'
import map from 'lodash/map'
import compareProps from '../helpers/compare-props'

import itemTypes from '../models/item-types'

import List from './list'
import CourseTitle from './course-title'
import buildCourseIdent from '../helpers/build-course-ident'
import Icon from './icon'
import ModalCourse from './modal-course'

import './inline-course.scss'

class Course extends Component {
	static propTypes = {
		conflicts: PropTypes.array,
		connectDragSource: PropTypes.func.isRequired,  // react-dnd
		course: PropTypes.object.isRequired,
		index: PropTypes.number,
		isDragging: PropTypes.bool.isRequired,  // react-dnd
		scheduleId: PropTypes.string,
		studentId: PropTypes.string,
	};

	static defaultProps = {
		conflicts: [],
	};

	state = {
		isOpen: false,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state, nextState)
	}

	closeModal = () => {
		this.setState({isOpen: false})
	};

	openModal = () => {
		this.setState({isOpen: true})
	};

	render() {
		const { course, conflicts, index, scheduleId, studentId } = this.props
		const warnings = conflicts[index || 0]
		const hasWarnings = compact(warnings).length

		const validWarnings = filter(warnings, w => !isNull(w) && w.warning === true)
		const warningEls = map(validWarnings, (w, index) =>
			<li key={index}><Icon name={w.icon} /> {w.msg}</li>)

		let classSet = cx('course course--inline info-wrapper', {
			expanded: this.state.isOpen,
			'has-warnings': hasWarnings,
			'is-dragging': this.props.isDragging,
		})

		const warningList = warningEls.length && (
			<List type='inline' className='warnings'>{warningEls}</List>
		)

		return this.props.connectDragSource(
			<article
				className={classSet}
				onClick={this.openModal}
			>
				{warningList || null}

				<div className='info-rows'>
					<CourseTitle title={course.title} name={course.name} type={course.type} />
					<div className='summary'>
						<span className='identifier'>
							{buildCourseIdent(course)}
						</span>
						<span className='type'>{course.type}</span>
						{course.gereqs && <ul className='gereqs'>
							{map(course.gereqs, (ge, idx) =>
								<li key={ge + idx}>{ge}</li>
							)}
						</ul>}
						{course.prerequisites &&
							<span className='has-prerequisite' title={course.prerequisites}>!</span>}
					</div>
					<div className='summary'>
						{course.times}
					</div>
				</div>

				{this.state.isOpen
					? <ModalCourse onClose={this.closeModal} course={course} scheduleId={scheduleId} studentId={studentId} />
					: null}
			</article>
		)
	}
}

// Implements the drag source contract.
const courseSource = {
	beginDrag(props) {
		let scheduleId = props.scheduleId || null
		return {
			isFromSchedule: scheduleId !== null,
			isFromSearch: scheduleId === null,
			clbid: props.course.clbid,
			groupid: props.course.groupid,
			fromScheduleId: scheduleId,
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

export default DragSource(itemTypes.COURSE, courseSource, collect)(Course)
