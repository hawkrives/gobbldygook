import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import includes from 'lodash/collection/includes'
import difference from 'lodash/array/difference'
import union from 'lodash/array/union'
import values from 'lodash/object/values'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import groupBy from 'lodash/collection/groupBy'
import has from 'lodash/object/has'
import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import keys from 'lodash/object/keys'
import pick from 'lodash/object/pick'
import isTrue from '../helpers/is-true'

import pathToOverride from '../area-tools/path-to-override'
import checkStudentGraduatability from '../helpers/check-student-graduatability'
import AreaOfStudyGroup from '../components/area-of-study-group'
import Button from '../components/button'
import StudentSummary from '../components/student-summary'
import * as areaTypeConstants from '../models/area-types'

import './graduation-status.scss'

export default class GraduationStatus extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		areas: PropTypes.array.isRequired,
		courses: PropTypes.array.isRequired,
		isHidden: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: {},
			showAreaPickerFor: {},
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	async componentWillReceiveProps(nextProps) {
		const {canGraduate, details} = await checkStudentGraduatability(nextProps.student)
		this.setState({
			graduatability: canGraduate,
			areaDetails: details,
		})
	}

	initiateAddArea = ({ev, type}) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: {...state.showAreaPickerFor, [type]: true},
		}))
	}

	endAddArea = ({ev, type}) => {
		ev.preventDefault()
		this.setState(state => ({
			showAreaPickerFor: {...state.showAreaPickerFor, [type]: false},
		}))
	}

	addAreaToStudent = ({ev, area}) => {
		ev.preventDefault()
		this.props.actions.addArea(this.props.student.id, area)
	}

	addOverrideToStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		this.props.actions.setOverride(this.props.student.id, codifiedPath, true)
	}

	removeOverrideFromStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)
		this.props.actions.setOverride(this.props.student.id, codifiedPath)
	}

	toggleOverrideOnStudent = ({ev, path}) => {
		ev.preventDefault()
		const codifiedPath = pathToOverride(path)

		if (has(this.props.student.overrides, codifiedPath)) {
			this.props.actions.removeOverride(this.props.student.id, codifiedPath)
		}
		else {
			this.props.actions.setOverride(this.props.student.id, codifiedPath, true)
		}
	}

	removeAreaFromStudent = ({ev, areaQuery}) => {
		ev.preventDefault()
		this.props.actions.removeArea(this.props.student.id, areaQuery)
	}

	render() {
		// console.log('GraduationStatus#render')
		const student = this.props.student

		if (!student) {
			return null
		}

		const allAreasGrouped = groupBy(this.props.areas, 'type')

		// group the studies by their type
		const groupedStudies = groupBy(
			this.props.student.studies,
			study => study.type.toLowerCase())

		// pull the results out of state, or use a mutable version from props
		const studyResults = mapValues(
			groupedStudies,
			areas => map(areas, area => this.state.areaDetails[area.id] || area))

		// and then render them
		const sections = map(studyResults,
			(areas, areaType) =>
				<AreaOfStudyGroup key={areaType}
					addArea={this.addAreaToStudent}
					addOverride={this.addOverrideToStudent}
					allAreasOfType={allAreasGrouped[areaType] || []}
					areas={areas || []}
					courses={this.props.courses}
					endAddArea={this.endAddArea}
					initiateAddArea={this.initiateAddArea}
					removeArea={this.removeAreaFromStudent}
					removeOverride={this.removeOverrideFromStudent}
					showAreaPicker={this.state.showAreaPickerFor[areaType]}
					studentId={this.props.student.id}
					toggleOverride={this.toggleOverrideOnStudent}
					type={areaType}
				/>)

		const usedAreaTypes = uniq(pluck(this.props.student.studies, 'type'))

		const allAreaTypes = values(areaTypeConstants)
		const areaTypesToShowButtonsFor = union(
			usedAreaTypes,
			keys(pick(this.state.showAreaPickerFor, isTrue)))
		const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

		const addUnusedAreaButtonList = (
			<section className='unused-areas-of-study'>
				<span className='unused-areas-title'>Add: </span>
				<span className='unused-areas-buttons'>
					{unusedTypes.map(type => (
						<Button key={type}
							className='add-unused-area-of-study'
							onClick={ev => this.initiateAddArea({ev, type})}
							type='flat'
						>
							{type}
						</Button>
					))}
				</span>
			</section>
		)

		const unusedTypesToShow = pick(this.state.showAreaPickerFor,
			(toShow, type) => toShow === true && !includes(usedAreaTypes, type))

		const unusedTypesToShowComponents = map(unusedTypesToShow,
			(toShow, type) =>
				<AreaOfStudyGroup key={type}
					addArea={this.addAreaToStudent}
					addOverride={this.addOverrideToStudent}
					allAreasOfType={allAreasGrouped[type] || []}
					areas={[]}
					endAddArea={this.endAddArea}
					initiateAddArea={this.initiateAddArea}
					removeArea={this.removeAreaFromStudent}
					showAreaPicker={toShow}
					toggleOverride={this.toggleOverrideOnStudent}
					type={type}
				/>)

		return (
			<section className={cx('graduation-status', {'is-hidden': this.props.isHidden})}>
				<StudentSummary
					courses={this.props.courses}
					student={student}
					graduatability={this.state.graduatability}
				/>

				{sections}

				{unusedTypesToShowComponents}

				{unusedTypes.length && addUnusedAreaButtonList}
			</section>
		)
	}
}
