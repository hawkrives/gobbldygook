import _ from 'lodash'
import React from 'react/addons'
import {ordinal} from 'humanize-plus'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/itemTypes'
import semesterName from 'sto-helpers/lib/semesterName'
import expandYear from 'sto-helpers/lib/expandYear'
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

	getDefaultProps() {
		return {
			conflicts: [],
		}
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
				msg: `Wrong Year (originally from ${expandYear(course.year, true, '–')})`,
				summary: 'Wrong Year',
			})
		}

		if (schedule && course.sem !== schedule.semester) {
			warnings.push({
				msg: `Wrong Semester (originally from ${semesterName(course.sem)})`,
				className: 'course-invalid-semester',
			})
		}

		if (conflicts && i !== undefined) {
			if (_.any(conflicts[i])) {
				let conflictIndex = _.findIndex(conflicts[i], isTrue)
				conflictIndex += 1 // because humans don't 0-index lists
				warnings.push({
					msg: `Time conflict with the ${ordinal(conflictIndex)} course`,
					className: 'course-time-conflict',
				})
			}
		}

		let warningEls = _.map(warnings, (w, index) => {
			let className = w.className || 'course-alert'
			return React.createElement('li', {className, key: className + index}, w.msg)
		})

		return [
			Boolean(warnings.length),
			React.createElement('ul',
				{className: 'warnings'},
				warningEls),
		]
	},

	render() {
		let course = this.props.info

		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

		let courseStyle = this.state.isOpen ? ExpandedCourse : CollapsedCourse
		let courseInfo = React.createElement(courseStyle, this.props)

		let [hasWarnings, warnings] = this.findWarnings()

		return React.createElement('article',
			Object.assign(
				{
					className: cx({
						course: true,
						expanded: this.state.isOpen,
						'has-warnings': hasWarnings,
						'is-dragging': isDragging,
					}),
					onClick: this.toggle,
				},
				this.dragSourceFor(itemTypes.COURSE)),

			warnings,
			courseInfo)
	},
})

export default Course
export {Course, MissingCourse, EmptyCourseSlot}
