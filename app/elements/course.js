import {_ as lodash, isNull} from 'lodash'
import React from 'react/addons'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/itemTypes'

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

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.info.clbid !== this.props.info.clbid ||
			nextState.isOpen !== this.state.isOpen
	},

	render() {
		let course = this.props.info

		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

		let courseStyle = this.state.isOpen ? ExpandedCourse : CollapsedCourse
		let courseInfo = React.createElement(courseStyle, this.props)

		let hasWarnings = this.props.conflicts.length
		let warnings = this.props.conflicts[this.props.index]
		let warningEls = lodash(warnings)
			.reject(isNull)
			.filter({warning: true})
			.map((w, index) =>
				React.createElement('li', {className: w.className, key: w.className + index}, w.msg))
			.value()

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

			React.createElement('ul', {className: 'warnings'}, warningEls),
			courseInfo)
	},
})

export default Course
export {Course, MissingCourse, EmptyCourseSlot}
