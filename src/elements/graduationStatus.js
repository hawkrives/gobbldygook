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

		const sections = this.props.student.studies
			.groupBy(study => study.type.toLowerCase())
			.map((areas, areaType) => {
				const pluralType = pluralizeArea(areaType)

				return (
					<section
						key={areaType}
						id={pluralType}
						className='area-of-study-group'>

						<header className='area-type-heading'>
							<h1>{capitalize(pluralType)}</h1>
						</header>

						{areas.map(baseArea => {
							const area = this.state.areaDetails.get(baseArea.id) || baseArea
							return <AreaOfStudy key={area.id} {...area} />
						}).toArray()}

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
