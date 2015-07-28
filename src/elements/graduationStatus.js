import React from 'react'
import capitalize from 'lodash/string/capitalize'
import pluralizeArea from '../lib/pluralize-area'
import Immutable from 'immutable'
import map from 'lodash/collection/map'
import difference from 'lodash/array/difference'

import AreaOfStudy from './area-of-study'
import StudentSummary from './studentSummary'

import debug from 'debug'
const log = debug('gobbldygook:component:render')

const allAreaTypes = ['degree', 'major', 'concentration', 'emphasis']

export default class GraduationStatus extends React.Component {
	static propTypes = {
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
			.groupBy(study => study.type.toLowerCase())
			.map((areas, areaType) => (
				<section key={areaType} className='area-of-study-group'>
					<h1 className='area-type-heading'>
						{capitalize(pluralizeArea(areaType))}
						<button className='add-area-of-study'>Add</button>
					</h1>

					{areas.map(baseArea => {
						const area = this.state.areaDetails.get(baseArea.id) || baseArea
						return <AreaOfStudy key={area.id} {...area} />
					}).toArray()}
				</section>
			))
			.toArray()

		const otherSections = this.props.student.studies
			.map(x => x.type)
			.toSet()
			.toJS()

		const unusedSectionsList = difference(allAreaTypes, otherSections)

		const unusedSections = (
			<section className='unused-area-of-studies'>
				Add: {map(unusedSectionsList, type => (
					<a key={type} className='add-unused-area-of-study'>{type}</a>
				))}
			</section>
		)

		return (
			<section className='graduation-status'>
				<StudentSummary student={student}
								graduatability={this.state.graduatability} />
				{sections}
				{unusedSections}
			</section>
		)
	}
}
