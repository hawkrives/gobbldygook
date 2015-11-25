import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'

import includes from 'lodash/collection/includes'
import difference from 'lodash/array/difference'
import union from 'lodash/array/union'
import values from 'lodash/object/values'

import pathToOverride from '../area-tools/path-to-override'

import AreaOfStudyGroup from '../components/area-of-study-group'
import Button from '../components/button'
import StudentSummary from '../components/student-summary'
import * as areaTypeConstants from '../models/area-types'

import actions from '../flux/student-actions'

import './graduation-status.scss'

export default class GraduationStatus extends Component {
	static propTypes = {
		allAreas: PropTypes.object, // Immutable.List
		courses: PropTypes.object, // Immutable.List
		coursesLoaded: PropTypes.bool.isRequired,
		isHidden: PropTypes.bool,
		student: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: Immutable.OrderedMap(),
			allAreas: Immutable.List(),
			showAreaPickerFor: Immutable.Map(),
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	async componentWillReceiveProps(nextProps) {
		const {canGraduate, details} = await nextProps.student.graduatability
		this.setState({
			graduatability: canGraduate,
			areaDetails: details,
		})
	}

	initiateAddArea = ({ev, type}) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: state.showAreaPickerFor.set(type, true),
		}))
	}

	endAddArea = ({ev, type}) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: state.showAreaPickerFor.set(type, false),
		}))
	}

	addAreaToStudent = ({ev, area}) => {
		ev.preventDefault()
		actions.addArea(this.props.student.id, area)
	}

	addOverrideToStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		actions.setOverride(this.props.student.id, {[codifiedPath]: true})
	}

	removeOverrideFromStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		actions.setOverride(this.props.student.id, {[codifiedPath]: false})
	}

	toggleOverrideOnStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)

		if (this.props.student.overrides.has(codifiedPath)) {
			actions.removeOverride(this.props.student.id, codifiedPath)
		}
		else {
			actions.setOverride(this.props.student.id, {[codifiedPath]: true})
		}
	}

	removeAreaFromStudent = ({ev, areaId}) => {
		ev.preventDefault()
		actions.removeArea(this.props.student.id, areaId)
	}

	render() {
		// console.log('GraduationStatus#render')
		const student = this.props.student

		if (!student) {
			return null
		}

		const allAreasGrouped = this.props.allAreas.groupBy(a => a.type)

		const sections = this.props.student.studies
			// group the studies by their type
			.groupBy(study => study.type.toLowerCase())
			// pull the results out of state, or use a mutable version from props
			.map(areas => areas.map(area => this.state.areaDetails.get(area.id) || area.toObject()))
			// then render them
			.map((areas, areaType) =>
				<AreaOfStudyGroup key={areaType}
					addArea={this.addAreaToStudent}
					addOverride={this.addOverrideToStudent}
					allAreas={allAreasGrouped.get(areaType) || Immutable.List()}
					areas={areas ? areas.toList() : Immutable.List()}
					courses={this.props.courses}
					coursesLoaded={this.props.coursesLoaded}
					endAddArea={this.endAddArea}
					initiateAddArea={this.initiateAddArea}
					removeArea={this.removeAreaFromStudent}
					removeOverride={this.removeOverrideFromStudent}
					showAreaPicker={this.state.showAreaPickerFor.get(areaType)}
					studentId={this.props.student.id}
					toggleOverride={this.toggleOverrideOnStudent}
					type={areaType}
				/>)
			.toArray()

		const usedAreaTypes = this.props.student.studies
			.map(a => a.get('type'))
			.toSet()
			.toArray()

		const allAreaTypes = values(areaTypeConstants)
		const areaTypesToShowButtonsFor = union(usedAreaTypes, [...this.state.showAreaPickerFor.filter(a => a === true).keys()])
		const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

		const addUnusedAreaButtonList = (
			<section className='unused-areas-of-study'>
				<span className='unused-areas-title'>Add: </span>
				<span className='unused-areas-buttons'>
					{unusedTypes.map(type => (
						<Button key={type}
							className='add-unused-area-of-study'
							onClick={ev => this.initiateAddArea({ev, type})}
							type='flat'>
							{type}
						</Button>
					))}
				</span>
			</section>
		)

		const unusedTypesToShow = this.state.showAreaPickerFor
			.filter((toShow, type) => toShow === true && !includes(usedAreaTypes, type))
			.map((toShow, type) =>
				<AreaOfStudyGroup key={type}
					addArea={this.addAreaToStudent}
					addOverride={this.addOverrideToStudent}
					allAreas={allAreasGrouped.get(type) || Immutable.List()}
					areas={Immutable.List()}
					endAddArea={this.endAddArea}
					initiateAddArea={this.initiateAddArea}
					removeArea={this.removeAreaFromStudent}
					showAreaPicker={toShow}
					toggleOverride={this.toggleOverrideOnStudent}
					type={type}
				/>)
			.toArray()

		return (
			<section className={cx('graduation-status', {'is-hidden': this.props.isHidden})}>
				<StudentSummary
					courses={this.props.courses}
					coursesLoaded={this.props.coursesLoaded}
					student={student}
					graduatability={this.state.graduatability}
				/>

				{sections}

				{unusedTypesToShow}

				{unusedTypes.length
					? addUnusedAreaButtonList
					: null}
			</section>
		)
	}
}
