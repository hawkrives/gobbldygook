import React from 'react'
import capitalize from 'lodash/string/capitalize'
import pluralizeArea from '../lib/pluralize-area'
import Immutable from 'immutable'

import AreaOfStudy from './area-of-study'
import StudentSummary from './studentSummary'

import debug from 'debug'
const log = debug('gobbldygook:component:render')

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
			.map((areas, areaType) => {
				const pluralType = pluralizeArea(areaType)

				return (
					<section
						key={areaType}
						id={pluralType}
						className='area-of-study-group'>

						<h1 className='area-type-heading'>
							{capitalize(pluralType)}
							<button className='add-area-of-study'>
								Add
							</button>
						</h1>

						{areas.map(baseArea => {
							const area = this.state.areaDetails.get(baseArea.id) || baseArea
							return <AreaOfStudy key={area.id} {...area} />
						}).toArray()}
					</section>
				)
			})
			.toArray()

		return (
			<section className='graduation-status'>
				<StudentSummary student={student}
								graduatability={this.state.graduatability} />
				{sections}
			</section>
		)
	}
}
