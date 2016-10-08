import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import {compact} from 'lodash'
import {filter} from 'lodash'
import {isNull} from 'lodash'
import {map} from 'lodash'

import {IDENT_COURSE} from '../../core/student-format/item-types'

import List from './list'
import CourseTitle from './course-title'
import {buildDeptNum} from 'modules/schools/stolaf'
import Icon from './icon'
import ModalCourse from './modal-course'

import './inline-course.scss'

class InlineCourse extends Component {
	static propTypes = {
		className: PropTypes.string,
		conflicts: PropTypes.array,
		connectDragSource: PropTypes.func.isRequired,  // react-dnd
		course: PropTypes.object.isRequired,
		index: PropTypes.number,
		isDragging: PropTypes.bool.isRequired,  // react-dnd
		scheduleId: PropTypes.string,
		studentId: PropTypes.string,
	};

	state = {
		isOpen: false,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.course !== nextProps.course ||
			this.props.conflicts !== nextProps.conflicts ||
			this.state.isOpen !== nextState.isOpen ||
			this.props.isDragging !== nextProps.isDragging
		)
	}

	closeModal = () => {
		this.setState({isOpen: false})
	};

	openModal = () => {
		this.setState({isOpen: true})
	};

	render() {
		const { course, conflicts=[], index, scheduleId, studentId } = this.props
		const warnings = conflicts[index || 0]
		const hasWarnings = compact(warnings).length

		const validWarnings = filter(warnings, w => !isNull(w) && w.warning === true)
		const warningEls = map(validWarnings, (w, idx) =>
			<li key={idx}><Icon>{w.icon}</Icon> {w.msg}</li>)

		let classSet = cx(this.props.className, 'course', {
			'expanded': this.state.isOpen,
			'has-warnings': hasWarnings,
			'is-dragging': this.props.isDragging,
		})

		const warningList = warningEls.length && (
			<List type='inline' className='course-warnings'>{warningEls}</List>
		)

		return this.props.connectDragSource(
			<article
				className={classSet}
				onClick={this.openModal}
			>
				{warningList || null}

				<CourseTitle className='course-row' title={course.title} name={course.name} type={course.type} />
				<div className='course-row course-summary'>
					<span className='course-identifier'>
						{buildDeptNum(course, true)}
					</span>
					{course.type !== 'Research' ? <span className='course-type'>{course.type}</span> : null}
					{course.gereqs && <ul className='course-gereqs'>
						{map(course.gereqs, (ge, idx) =>
							<li key={ge + idx}>{ge}</li>
						)}
					</ul>}
					{course.prerequisites &&
						<span className='has-prerequisite' title={course.prerequisites}>Prereq</span>}
				</div>
				<div className='course-row course-summary'>
					{course.times}
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

export default DragSource(IDENT_COURSE, courseSource, collect)(InlineCourse)
