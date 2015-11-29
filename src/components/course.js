import React, {Component, PropTypes} from 'react'
import {DragSource} from 'react-dnd'
import cx from 'classnames'
import compact from 'lodash/array/compact'
import filter from 'lodash/collection/filter'
import isNull from 'lodash/lang/isNull'
import map from 'lodash/collection/map'

import itemTypes from '../models/item-types'

import List from './list'
import DetailedCourse from './detailed-course'
import BasicCourse from './basic-course'
import Button from './button'
import Icon from './icon'
import Toolbar from './toolbar'

import Modal from './modal'

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
		actions: PropTypes.object.isRequired,
		conflicts: PropTypes.array,
		connectDragSource: PropTypes.func.isRequired,  // react-dnd
		course: PropTypes.object.isRequired,
		index: PropTypes.number,
		isDragging: PropTypes.bool.isRequired,  // react-dnd
		schedule: PropTypes.object,
		student: PropTypes.object,
	}

	static defaultProps = {
		conflicts: [],
	}

	constructor() {
		super()
		this.state = {isOpen: false}
	}

	closeModal = () => {
		this.setState({isOpen: false})
	}

	openModal = () => {
		this.setState({isOpen: true})
	}

	render() {
		// console.log('Course#render')
		const warnings = this.props.conflicts[this.props.index || 0]
		const hasWarnings = compact(warnings).length

		const validWarnings = filter(warnings, w => !isNull(w) && w.warning === true)
		const warningEls = map(validWarnings, (w, index) =>
			<span key={index}><Icon name={w.icon} /> {w.msg}</span>)

		let classSet = cx('course', {
			expanded: this.state.isOpen,
			'has-warnings': hasWarnings,
			'is-dragging': this.props.isDragging,
		})

		const warningList = warningEls.length && (
			<List type='inline' className='warnings'>{warningEls}</List>
		)

		const modal = this.state.isOpen && (
			<Modal
				backdropClassName='modal-backdrop'
				modalClassName='course course--modal'
				onClose={this.closeModal}
			>
				<Toolbar className='window-tools'>
					<Button className='close-modal' onClick={this.closeModal}>
						<Icon name='close' />
					</Button>
				</Toolbar>

				<DetailedCourse {...this.props} className='content'>
					{warningList || null}
				</DetailedCourse>
			</Modal>
		)

		return this.props.connectDragSource(
			<article className={classSet} onClick={this.openModal}>
				{warningList || null}

				<BasicCourse className='course--inline info-wrapper' course={this.props.course} />

				{modal || null}
			</article>
		)
	}
}

export default DragSource(itemTypes.COURSE, courseSource, collect)(Course)
