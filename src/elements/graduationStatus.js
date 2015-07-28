import React from 'react'
import Immutable from 'immutable'
import map from 'lodash/collection/map'
import difference from 'lodash/array/difference'
import cx from 'classnames'

import AreaOfStudyGroup from './area-of-study-group'
import StudentSummary from './studentSummary'

import debug from 'debug'
const log = debug('gobbldygook:component:render')

const allAreaTypes = ['degree', 'major', 'concentration', 'emphasis']

export default class GraduationStatus extends React.Component {
	static propTypes = {
		isHidden: React.PropTypes.bool,
		student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
	}

	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: Immutable.Map(),
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	async componentWillReceiveProps(nextProps) {
		const {graduatability, areaDetails} = await nextProps.student.graduatability
		this.setState({graduatability, areaDetails})
	}

	render() {
		log('GraduationStatus#render')
		let student = this.props.student

		if (!student) {
			return null
		}

		const sections = this.props.student.studies
			// group the studies by their type
			.groupBy(study => study.type.toLowerCase())
			// pull the results out of state
			.map(areas => areas.map(a => this.state.areaDetails.get(a.id) || a))
			// then render them
			.map((areas, areaType) =>
				<AreaOfStudyGroup key={areaType} type={areaType} areas={areas.toList()} />)
			.toArray()

		const otherSections = this.props.student.studies
			.map(x => x.type)
			.toSet()
			.toJS()

		const unusedSectionsList = difference(allAreaTypes, otherSections)

		return (
			<section className={cx('graduation-status', {'is-hidden': this.props.isHidden})}>
				<StudentSummary student={student}
								graduatability={this.state.graduatability} />

				{sections}

				<section className='unused-area-of-studies'>
					<span className='unused-areas-title'>Add: </span>
					{map(unusedSectionsList, type => (
						<button key={type} className='add-unused-area-of-study'>{type}</button>
					))}
				</section>
			</section>
		)
	}
}
