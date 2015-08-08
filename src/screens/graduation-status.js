import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import Immutable from 'immutable'

import debug from 'debug'
import map from 'lodash/collection/map'
import difference from 'lodash/array/difference'

import AreaOfStudyGroup from '../components/area-of-study-group'
import Button from '../components/button'
import Student from '../models/student'
import StudentSummary from '../components/student-summary'
import areaTypes from '../models/area-types'

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
			.map(areas => areas.map(a => this.state.areaDetails.get(a.id) || a.toObject()))
			// then render them
			.map((areas, areaType) =>
				<AreaOfStudyGroup key={areaType}
					studentId={student.id}
					type={areaType}
					areas={areas.toList()}
					allAreas={allAreasGrouped.get(areaType)} />)
			.toArray()

		const otherSections = this.props.student.studies
			.map(x => x.type)
			.toSet()
			.toArray()

		const unusedSectionsList = difference(areaTypes, otherSections)

		return (
			<section className={cx('graduation-status', {'is-hidden': this.props.isHidden})}>
				<StudentSummary student={student}
								graduatability={this.state.graduatability} />

				{sections}

				<section className='unused-area-of-studies'>
					<span className='unused-areas-title'>Add: </span>
					{map(unusedSectionsList, type => (
						<Button key={type} className='add-unused-area-of-study'
							type='flat'>
							{type}
						</Button>
					))}
				</section>
			</section>
		)
	}
}
