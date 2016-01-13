import React, {Component, PropTypes} from 'react'
import cx from 'classnames'

import includes from 'lodash/collection/includes'
import difference from 'lodash/array/difference'
import union from 'lodash/array/union'
import values from 'lodash/object/values'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import groupBy from 'lodash/collection/groupBy'
import has from 'lodash/object/has'
import uniq from 'lodash/array/uniq'
import pluck from 'lodash/collection/pluck'
import keys from 'lodash/object/keys'
import pick from 'lodash/object/pick'

import compareProps from '../helpers/compare-props'
import pathToOverride from '../area-tools/path-to-override'
import checkStudentGraduatability from '../helpers/check-student-graduatability'
import AreaOfStudyGroup from '../components/area-of-study-group'
import Button from '../components/button'
import StudentSummary from '../components/student-summary'
import * as areaTypeConstants from '../models/area-types'

import './graduation-status.scss'


class GraduationStatus extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		addAreaToStudent: PropTypes.func.isRequired,
		addOverrideToStudent: PropTypes.func.isRequired,
		areaDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
		areas: PropTypes.arrayOf(PropTypes.object).isRequired,
		canGraduate: PropTypes.bool.isRequired,
		courses: PropTypes.arrayOf(PropTypes.object).isRequired,
		endAddArea: PropTypes.func.isRequired,
		initiateAddArea: PropTypes.func.isRequired,
		isHidden: PropTypes.bool.isRequired,
		removeAreaFromStudent: PropTypes.func.isRequired,
		removeOverrideFromStudent: PropTypes.func.isRequired,
		showAreaPickerFor: PropTypes.object.isRequired,
		student: PropTypes.object.isRequired,
		toggleOverrideOnStudent: PropTypes.func.isRequired,
	};

	static defaultProps = {
		areaDetails: [],
		canGraduate: false,
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		const {
			addAreaToStudent,
			addOverrideToStudent,
			areaDetails,
			areas,
			canGraduate,
			courses,
			endAddArea,
			initiateAddArea,
			isHidden,
			removeAreaFromStudent,
			removeOverrideFromStudent,
			showAreaPickerFor,
			student,
			toggleOverrideOnStudent,
		} = this.props

		if (!student) {
			return null
		}

		const allAreasGrouped = groupBy(areas, 'type')

		// group the studies by their type
		const groupedStudies = groupBy(student.studies, study => study.type.toLowerCase())

		// pull out the results
		const studyResults = mapValues(groupedStudies, group =>
			map(group, area =>
				find(areaDetails, pick(area, ['name', 'type', 'revision'])) || area))

		// and then render them
		const sections = map(studyResults, (areas, areaType) =>
			<AreaOfStudyGroup key={areaType}
				addArea={addAreaToStudent}
				addOverride={addOverrideToStudent}
				allAreasOfType={allAreasGrouped[areaType] || []}
				areas={areas}
				courses={courses}
				endAddArea={endAddArea}
				initiateAddArea={initiateAddArea}
				removeArea={removeAreaFromStudent}
				removeOverride={removeOverrideFromStudent}
				showAreaPicker={showAreaPickerFor[areaType]}
				student={student}
				toggleOverride={toggleOverrideOnStudent}
				type={areaType}
			/>)

		const allAreaTypes = values(areaTypeConstants)
		const usedAreaTypes = uniq(pluck(student.studies, 'type'))

		const areaTypesToShowButtonsFor = union(
			usedAreaTypes,
			keys(pick(showAreaPickerFor, k => k === true)))

		const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

		const unusedAreaTypeButtons = (
			<section className='unused-areas-of-study'>
				<span className='unused-areas-title'>Add: </span>
				<span className='unused-areas-buttons'>
					{unusedTypes.map(type => (
						<Button key={type}
							className='add-unused-area-of-study'
							onClick={ev => initiateAddArea({ev, type})}
							type='flat'
						>
							{type}
						</Button>
					))}
				</span>
			</section>
		)

		const unusedTypesToShow = pick(showAreaPickerFor,
			(toShow, type) => toShow === true && !includes(usedAreaTypes, type))

		const unusedTypesToShowComponents = map(unusedTypesToShow, (toShow, type) =>
			<AreaOfStudyGroup key={type}
				addArea={addAreaToStudent}
				addOverride={addOverrideToStudent}
				allAreasOfType={allAreasGrouped[type] || []}
				areas={[]}
				endAddArea={endAddArea}
				initiateAddArea={initiateAddArea}
				removeArea={removeAreaFromStudent}
				showAreaPicker={toShow}
				student={student}
				toggleOverride={toggleOverrideOnStudent}
				type={type}
			/>)

		return (
			<section className={cx('graduation-status', {'is-hidden': isHidden})}>
				<StudentSummary
					actions={this.props.actions}
					courses={courses}
					student={student}
					canGraduate={canGraduate}
				/>

				{sections}

				{unusedTypesToShowComponents}

				{unusedTypes.length && unusedAreaTypeButtons}
			</section>
		)
	}
}


export default class GraduationStatusContainer extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		areas: PropTypes.array.isRequired,
		courses: PropTypes.array.isRequired,
		isHidden: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props)
		this.state = {
			canGraduate: false,
			areaDetails: [],
			showAreaPickerFor: {},
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		checkStudentGraduatability(nextProps.student)
			.then(({canGraduate, details}) => {
				this.setState({
					canGraduate: canGraduate,
					areaDetails: details,
				})
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

		return (
			<GraduationStatus
				actions={this.props.actions}
				addAreaToStudent={this.addAreaToStudent}
				addOverrideToStudent={this.addOverrideToStudent}
				areas={this.props.areas}
				areaDetails={this.state.areaDetails}
				courses={this.props.courses}
				endAddArea={this.endAddArea}
				canGraduate={this.state.canGraduate}
				initiateAddArea={this.initiateAddArea}
				isHidden={this.props.isHidden}
				removeAreaFromStudent={this.removeAreaFromStudent}
				removeOverrideFromStudent={this.removeOverrideFromStudent}
				showAreaPickerFor={this.state.showAreaPickerFor}
				student={this.props.student}
				toggleOverrideOnStudent={this.toggleOverrideOnStudent}
			/>
		)
	}
}
