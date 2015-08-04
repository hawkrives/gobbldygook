import React, {PropTypes} from 'react'
import cx from 'classnames'
import compact from 'lodash/array/compact'
import filter from 'lodash/collection/filter'
import isNull from 'lodash/lang/isNull'
import map from 'lodash/collection/map'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/item-types'

import List from './list'
import DetailedCourse from './detailed-course'
import BasicCourse from './basic-course'

let Course = React.createClass({
	propTypes: {
		conflicts: PropTypes.array,
		index: PropTypes.number,
		info: PropTypes.object.isRequired,
		schedule: PropTypes.object,
	},

	mixins: [DragDropMixin],

	statics: {
		configureDragDrop(registerType) {
			registerType(itemTypes.COURSE, {
				dragSource: {
					beginDrag(component) {
						let scheduleId = component.props.schedule ? component.props.schedule.id : null
						return {
							item: {
								clbid: component.props.info.clbid,
								fromSchedule: scheduleId,
							},
						}
					},
				},
			})
		},
	},

	getDefaultProps() {
		return {
			conflicts: [],
		}
	},

	getInitialState() {
		return {isOpen: false}
	},

	toggleExpanded() {
		this.setState({isOpen: !this.state.isOpen})
	},

	render() {
		// console.log('Course#render')
		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

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
			'is-dragging': isDragging,
		})

		return (
			<article className={classSet} {...this.dragSourceFor(itemTypes.COURSE)}>
				<InnerCourse {...this.props} onClick={this.toggleExpanded}>
					{warningEls.length
						? <List type='inline' className='warnings'>{warningEls}</List>
						: null}
				</InnerCourse>
			</article>
		)
	},
})

export default Course
