import {chain} from 'lodash'
import compact from 'lodash/array/compact'
import isNull from 'lodash/lang/isNull'
import React from 'react'
import cx from 'classnames'
import {DragDropMixin} from 'react-dnd'

import itemTypes from '../models/itemTypes'

import ExpandedCourse from './expandedCourse'
import CollapsedCourse from './collapsedCourse'

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

	statics: {
		configureDragDrop(registerType) {
			registerType(itemTypes.COURSE, {
				dragSource: {
					beginDrag(component) {
						let {props} = component
						let scheduleId = props.schedule ? props.schedule.id : null
						return {
							item: {
								clbid: props.info.clbid,
								fromSchedule: scheduleId,
							}
						}
					},
				}
			})
		},
	},

	getInitialState() {
		return {
			isOpen: false,
		}
	},

	toggleExpanded() {
		// console.log(this.state.isOpen ? 'collapse' : 'expand')
		this.setState({
			isOpen: !this.state.isOpen,
		})
	},

	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.info.clbid !== this.props.info.clbid ||
			nextState.isOpen !== this.state.isOpen
	},

	render() {
		// console.log('Course#render')
		let isDragging = this.getDragState(itemTypes.COURSE).isDragging

		let InnerCourse = this.state.isOpen ? ExpandedCourse : CollapsedCourse

		let warnings = this.props.conflicts[this.props.index]
		let hasWarnings = compact(warnings).length
		let warningEls = chain(warnings)
			.reject(isNull)
			.filter({warning: true})
			.map((w, index) => <li className={w.className} key={w.className + index}>{w.msg}</li>)
			.value()

		let classSet = cx('course', {
			expanded: this.state.isOpen,
			'has-warnings': hasWarnings,
			'is-dragging': isDragging,
		})

		return <article className={classSet} {...this.dragSourceFor(itemTypes.COURSE)}>
			<InnerCourse {...this.props} onClick={this.toggleExpanded}>
				{warningEls.length ? <ul className='warnings'>{warningEls}</ul> : null}
			</InnerCourse>
		</article>
	},
})

export default Course
