import React from 'react'
import {capitalize, pluralize} from 'humanize-plus'
import Immutable from 'immutable'

import AreaOfStudy from '../elements/areaOfStudy'
import StudentSummary from '../elements/studentSummary'

import checkStudentGraduatability from '../helpers/checkStudentGraduatability'

class GraduationStatus extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			graduatability: false,
			areaDetails: Immutable.List(),
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((nextProps.student !== this.props.student) ||
			(nextState.areaDetails !== this.state.areaDetails))
	}

	async componentWillReceiveProps(nextProps) {
		let graduationStatus = await nextProps.student.checkGraduatability()

		let {graduatability, areaDetails} = graduationStatus
		this.setState({graduatability, areaDetails})
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	render() {
		console.info('GraduationStatus#render')
		let student = this.props.student

		if (!student) {
			return null
		}

		let summary = <StudentSummary
			student={student}
			graduatability={this.state.graduatability} />

		let sections = student.areasByType
			.map((areas, areaType) => {
				let pluralType = pluralize(2, areaType, areaType === 'emphasis' ? 'emphases' : undefined)

				let areaTypeHeading = <header className='area-type-heading'>
					<h1>{capitalize(pluralType)}</h1>
				</header>

				let areaElements = areas.toList().map((area, index) => {
					let areaResult = this.state.areaDetails.find(a => a.id === area.id)

					let props = {student, areaResult, area}
					return <AreaOfStudy key={`${area.id}-${index}`} {...props} />
				}).toJS()

				areaElements.push(
					<button key='add-button' className='add-area-of-study'>
						{`Add ${capitalize(areaType)}`}
					</button>)

				return <section id={pluralType} key={areaType} className='area-of-study-group'>
					{areaTypeHeading}
					{areaElements}
				</section>
			}).toArray()

		return <section className='graduation-status'>
			{summary}
			{sections}
		</section>
	}
}

GraduationStatus.propTypes = {
	student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
}

export default GraduationStatus
