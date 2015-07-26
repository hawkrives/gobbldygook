import React from 'react'
import {capitalize, pluralize} from 'humanize-plus'
import Immutable from 'immutable'

import AreaOfStudy from '../elements/area-of-study'
import StudentSummary from '../elements/studentSummary'

import debug from 'debug'
const log = debug('gobbldygook:component:render')

class GraduationStatus extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: Immutable.Map(),
		}
	}

	// shouldComponentUpdate(nextProps, nextState) {
	//  return ((nextProps.student !== this.props.student) ||
	//      (nextState.areaDetails !== this.state.areaDetails))
	// }

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

		const sections = this.state.areaDetails
			.groupBy(a => a.type.toLowerCase())
			.map((areas, areaType) => {
				const pluralType = pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)

				return (
					<section
						key={areaType}
						id={pluralType}
						className='area-of-study-group'>

						<header className='area-type-heading'>
							<h1>{capitalize(pluralType)}</h1>
						</header>

						{areas.map((area) =>
							<AreaOfStudy key={area.id} {...area} />).toArray()}

						<button className='add-area-of-study'>
							Add {capitalize(areaType)}
						</button>
					</section>
				)
			})
			.toArray()

		return (<section className='graduation-status'>
			<StudentSummary student={student}
							graduatability={this.state.graduatability} />
			{sections}
		</section>)
	}
}

GraduationStatus.propTypes = {
	student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
}

export default GraduationStatus
