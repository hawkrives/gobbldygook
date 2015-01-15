import _ from 'lodash'
import React from 'react/addons'
import {ordinal} from 'humanize-plus'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/itemTypes'
import semesterName from 'sto-helpers/lib/semesterName'
import {isTrue} from 'sto-helpers/lib/is'

import ExpandedCourse from './expandedCourse'
import CollapsedCourse from './collapsedCourse'
import MissingCourse from './missingCourse'
import EmptyCourseSlot from './emptyCourseSlot'

let cx = React.addons.classSet

let Course = React.createClass({
	propTypes: {
		schedule: React.PropTypes.object,
		conflicts: React.PropTypes.array,
		index: React.PropTypes.number,
		info: React.PropTypes.object.isRequired,
	},

	mixins: [DragDropMixin],

	configureDragDrop(registerType) {
		registerType(itemTypes.COURSE, {
			dragSource: {
				beginDrag() {
					let scheduleId = this.props.schedule ? this.props.schedule.id : null
					return {
						item: {clbid: this.props.info.clbid, fromSchedule: scheduleId}
					}
				},
			}
		})
	},

	getInitialState() {
		return {
			isOpen: false
		}
	},

	toggle() {
		// console.log(this.state.isOpen ? 'collapse' : 'expand')
		this.setState({
			isOpen: !this.state.isOpen
		})
	},

	findWarnings() {
		let thisYear = new Date().getFullYear()
		let warnings = []

		let {schedule, info: course, conflicts, index: i} = this.props

		if (schedule && (course.year !== schedule.year) && schedule.year <= thisYear) {
			warnings.push({
				msg: `This course (from ${course.year}) is not offered in this year (${schedule.year}).`
			})
		}

		if (schedule && course.sem !== schedule.semester) {
			warnings.push({
				msg: `This course (from ${semesterName(course.sem)}) is not offered in this semester.`,
				className: 'course-invalid-semester',
			})
		}

		if (conflicts && i !== undefined) {
			if (_.any(conflicts[i])) {
				let conflictIndex = _.findIndex(conflicts[i], isTrue)
				conflictIndex = conflictIndex + 1 // because humans don't 0-index lists
				warnings.push({
					msg: `This course has a time conflict with the ${ordinal(conflictIndex)} course.`,
					className: 'course-time-conflict',
				})
			}
		}

		let warningEls = _.map(warnings, (w, index) => {
			let className = w.className || 'course-alert'
			return React.createElement('span', {className, title: w.msg, key: className + index})
		})

		return React.createElement('div',
			{className: 'warnings'},
			warningEls)
	},

	render() {
		let course = this.props.info

		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

		let courseStyle = this.state.isOpen ? ExpandedCourse : CollapsedCourse
		let courseInfo = React.createElement(courseStyle, this.props)

		let warnings = this.findWarnings()

		return React.createElement('article',
			Object.assign(
				{
					className: cx({
						course: true,
						expanded: this.state.isOpen,
						'is-dragging': isDragging,
					}),
					onClick: this.toggle,
				},
				this.dragSourceFor(itemTypes.COURSE)),

			courseInfo,
			warnings)
	},
})

export default Course
export {Course, MissingCourse, EmptyCourseSlot}
