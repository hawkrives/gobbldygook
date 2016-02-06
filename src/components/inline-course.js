import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import isNull from 'lodash/isNull'
import map from 'lodash/map'

import {COURSE} from '../models/item-types'

import List from './list'
import CourseTitle from './course-title'
import buildCourseIdent from '../helpers/build-course-ident'
import Icon from './icon'
import ModalCourse from './modal-course'

import styles from './inline-course.scss'

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

	static defaultProps = {
		conflicts: [],
	};

	state = {
		isOpen: false,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.course !== nextProps.course ||
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
		const { course, conflicts, index, scheduleId, studentId } = this.props
		const warnings = conflicts[index || 0]
		const hasWarnings = compact(warnings).length

		const validWarnings = filter(warnings, w => !isNull(w) && w.warning === true)
		const warningEls = map(validWarnings, (w, index) =>
			<li key={index}><Icon name={w.icon} /> {w.msg}</li>)

		let classSet = cx(this.props.className, styles.course, {
			[styles.expanded]: this.state.isOpen,
			[styles.hasWarnings]: hasWarnings,
			[styles.isDragging]: this.props.isDragging,
		})

		const warningList = warningEls.length && (
			<List type='inline' className={styles.warnings}>{warningEls}</List>
		)

		return this.props.connectDragSource(
			<article
				className={classSet}
				onClick={this.openModal}
			>
				{warningList || null}

				<CourseTitle className={styles.row} title={course.title} name={course.name} type={course.type} />
				<div className={styles.row + ' ' + styles.summary}>
					<span className={styles.identifier}>
						{buildCourseIdent(course)}
					</span>
					{course.type !== 'Research' ? <span className={styles.type}>{course.type}</span> : null}
					{course.gereqs && <ul className={styles.gereqs}>
						{map(course.gereqs, (ge, idx) =>
							<li key={ge + idx}>{ge}</li>
						)}
					</ul>}
					{course.prerequisites &&
						<span className={styles.hasPrerequisite} title={course.prerequisites}>Prereq</span>}
				</div>
				<div className={styles.row + ' ' + styles.summary}>
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

export default DragSource(COURSE, courseSource, collect)(InlineCourse)
