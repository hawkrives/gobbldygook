import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'

import debug from 'debug'
import map from 'lodash/collection/map'
import includes from 'lodash/collection/includes'
import difference from 'lodash/array/difference'
import union from 'lodash/array/union'

import AreaOfStudyGroup from '../components/area-of-study-group'
import Button from '../components/button'
import Student from '../models/student'
import StudentSummary from '../components/student-summary'
import allAreaTypes from '../models/area-types'

import actions from '../flux/student-actions'
import db from '../lib/db'

const log = debug('gobbldygook:component:render')

export default class GraduationStatus extends Component {
	static propTypes = {
		isHidden: PropTypes.bool,
		student: PropTypes.instanceOf(Student).isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: Immutable.Map(),
			allAreas: Immutable.List(),
			showAreaPickerFor: Immutable.Map(),
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	async componentWillReceiveProps(nextProps) {
		const {graduatability, areaDetails} = await nextProps.student.graduatability
		const allAreas = Immutable.List(await db.stores.areas.all())
		this.setState({graduatability, areaDetails, allAreas})
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

	removeAreaFromStudent = ({ev, areaId}) => {
		ev.preventDefault()
		actions.removeArea(this.props.student.id, areaId)
	}

	render() {
		log('GraduationStatus#render')
		let student = this.props.student

		if (!student) {
			return null
		}

		const allAreasGrouped = this.state.allAreas.groupBy(a => a.type)

		const sections = this.props.student.studies
			// group the studies by their type
			.groupBy(study => study.type.toLowerCase())
			// pull the results out of state, or use a mutable version from props
			.map(areas => areas.map(area => this.state.areaDetails.get(area.id) || area.toObject()))
			// then render them
			.map((areas, areaType) =>
				<AreaOfStudyGroup key={areaType}
					showAreaPicker={this.state.showAreaPickerFor.get(areaType)}
					type={areaType}
					areas={areas ? areas.toList() : Immutable.List()}
					initiateAddArea={this.initiateAddArea}
					endAddArea={this.endAddArea}
					addArea={this.addAreaToStudent}
					removeArea={this.removeAreaFromStudent}
					allAreas={allAreasGrouped.get(areaType) || Immutable.List()} />)
			.toArray()

		const usedAreaTypes = this.props.student.studies
			.map(a => a.get('type'))
			.toSet()
			.toArray()

		const areaTypesToShowButtonsFor = union(usedAreaTypes, [...this.state.showAreaPickerFor.filter(a => a === true).keys()])
		const unusedTypes = difference(allAreaTypes, areaTypesToShowButtonsFor)

		const addUnusedAreaButtonList = (
			<section className='unused-area-of-studies'>
				<span className='unused-areas-title'>Add: </span>
				{unusedTypes.map(type => (
					<Button key={type}
						className='add-unused-area-of-study'
						onClick={(ev) => this.initiateAddArea({ev, type})}
						type='flat'>
						{type}
					</Button>
				))}
			</section>
		)

		const unusedTypesToShow = this.state.showAreaPickerFor
			.filter((toShow, type) => toShow === true && !includes(usedAreaTypes, type))
			.map((toShow, type) =>
				<AreaOfStudyGroup key={type}
					showAreaPicker={toShow}
					type={type}
					areas={Immutable.List()}
					initiateAddArea={this.initiateAddArea}
					endAddArea={this.endAddArea}
					addArea={this.addAreaToStudent}
					removeArea={this.removeAreaFromStudent}
					allAreas={allAreasGrouped.get(type) || Immutable.List()} />)
			.toArray()

		return (
			<section className={cx('graduation-status', {'is-hidden': this.props.isHidden})}>
				<StudentSummary
					student={student}
					graduatability={this.state.graduatability} />

				{sections}

				{unusedTypesToShow}

				{unusedTypes.length
					? addUnusedAreaButtonList
					: null}
			</section>
		)
	}
}
