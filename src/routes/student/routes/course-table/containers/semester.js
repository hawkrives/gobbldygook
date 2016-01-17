import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {DropTarget} from 'react-dnd'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import filter from 'lodash/collection/filter'
import map from 'lodash/collection/map'
import isCurrentSemester from '../../../../../helpers/is-current-semester'
import compareProps from '../../../../../helpers/compare-props'
import itemTypes from '../../../../../models/item-types'
import Loading from '../../../../../components/loading'
import {destroySchedules, setPartialQuery} from '../../../../../redux/students/actions'
import Semester from '../components/semester'


function getSchedule(student, year, semester) {
	return find(
		filter(student.schedules, sched => sched.active),
		isCurrentSemester(year, semester))
}


const initiateSearch = (setPartialQuery, schedule) => {
	setPartialQuery({
		term: [Number(`${schedule.year}${schedule.semester}`)],
	})
}

const removeSemester = (destroySchedules, student, year, semester) => {
	const thisSemesterSchedules = filter(student.schedules, isCurrentSemester(year, semester))
	const scheduleIds = map(thisSemesterSchedules, s => s.id)

	destroySchedules(student.id, ...scheduleIds)
}


export class SemesterContainer extends Component {
	static propTypes = {
		canDrop: PropTypes.bool.isRequired,  // react-dnd
		connectDropTarget: PropTypes.func.isRequired,  // react-dnd
		destroySchedules: PropTypes.func.isRequired,
		isOver: PropTypes.bool.isRequired,  // react-dnd
		semester: PropTypes.number.isRequired,
		setPartialQuery: PropTypes.func.isRequired, // redux
		student: PropTypes.object.isRequired,
		year: PropTypes.number.isRequired,
	};

	shouldComponentUpdate(nextProps, nextState) {
		return compareProps(this.props, nextProps) || compareProps(this.state, nextState)
	}

	render() {
		const { student, semester, year, canDrop, isOver } = this.props
		const schedule = getSchedule(student, year, semester)

		if (schedule.isValidating) {
			return <Loading>Loading Courses…</Loading>
		}

		return this.props.connectDropTarget(
			<Semester
				canDrop={canDrop}
				isOver={isOver}
				student={student}
				schedule={schedule}
				year={year}
				semester={semester}
				initiateSearch={() => initiateSearch(this.props.setPartialQuery, schedule)}
				removeSemester={() => removeSemester(this.props.destroySchedules, student, year, semester)}
			/>
		)
	}
}


// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor, component) {
		const item = monitor.getItem()
		console.log('dropped course', item)
		const {clbid, fromScheduleId, isFromSchedule} = item
		const toSchedule = getSchedule(component.props.student, component.props.year, component.props.semester)

		if (isFromSchedule) {
			props.actions.moveCourse(props.student.id, fromScheduleId, toSchedule.id, clbid)
		}
		else {
			props.actions.addCourse(props.student.id, toSchedule.id, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		const schedule = getSchedule(props.student, props.year, props.semester)
		const hasClbid = includes(schedule.clbids, item.clbid)
		return !hasClbid
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}
}

const droppable = DropTarget(itemTypes.COURSE, semesterTarget, collect)(SemesterContainer)


const mapDispatchToProps = dispatch =>
	bindActionCreators({setPartialQuery, destroySchedules}, dispatch)

const connected = connect(undefined, mapDispatchToProps)(droppable)


export default connected
