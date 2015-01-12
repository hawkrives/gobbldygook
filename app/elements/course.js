import _ from 'lodash'
import React from 'react/addons'
import humanize from 'humanize-plus'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/itemTypes'
import semesterName from 'sto-helpers/lib/semesterName'

import ExpandedCourse from './expandedCourse'
import CollapsedCourse from './collapsedCourse'
import MissingCourse from './missingCourse'
import EmptyCourseSlot from './emptyCourseSlot'

let cx = React.addons.classSet

function findSemesterList() {
	return [
		{id: 1, title: 'Fall 2012-13'},
		{id: 2, title: 'Interim 2012-13'},
		{id: 3, title: 'Spring 2012-13'},
	]
}

let Course = React.createClass({
	propTypes: {
		schedule: React.PropTypes.object.isRequired,
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

		if (this.props.schedule && (this.props.info.year !== this.props.schedule.year) && this.props.schedule.year <= thisYear) {
			warnings.push({
				msg: `This course (from ${this.props.info.year}) is not offered in this year (${this.props.schedule.year}).`
			})
		}

		if (this.props.schedule && this.props.info.sem !== this.props.schedule.semester) {
			warnings.push({
				msg: `This course (from ${semesterName(this.props.info.sem)}) is not offered in this semester.`,
				className: 'course-invalid-semester',
			})
		}

		if (this.props.conflicts && !_.isUndefined(this.props.index)) {
			let i = this.props.index
			if (_.any(this.props.conflicts[i])) {
				let conflictIndex = _.findIndex(this.props.conflicts[i], item => item === true)
				conflictIndex = conflictIndex + 1 // because humans don't 0-index lists
				warnings.push({
					msg: `This course has a time conflict with the ${humanize.ordinal(conflictIndex)} course.`,
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

		let courseInfo = this.state.isOpen ?
			React.createElement(ExpandedCourse, this.props) :
			React.createElement(CollapsedCourse, this.props)

		let warnings = this.findWarnings()

		return React.createElement('article',
			_.extend(
				{
					className: cx({
						course: true,
						expanded: this.state.isOpen,
						'is-dragging': isDragging,
					}),
					onClick: this.toggle,
				},
				this.dragSourceFor(itemTypes.COURSE)),

			courseInfo, warnings
		)
	},
})

export default Course
export {Course, MissingCourse, EmptyCourseSlot}
