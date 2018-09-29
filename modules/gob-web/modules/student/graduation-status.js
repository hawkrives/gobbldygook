// @flow
import React from 'react'

import {AreaOfStudySidebar} from './area-of-study-sidebar'
import {ConnectedStudentSummary} from './connected-student-summary'
import type {HydratedStudentType} from '@gob/object-student'

import './graduation-status.scss'

type Props = {
	student: HydratedStudentType,
}

class GraduationStatusContainer extends React.Component<Props> {
	render() {
		const student = this.props.student
		if (!student) {
			return <p>No student loaded.</p>
		}

		return (
			<section className="graduation-status">
				<ConnectedStudentSummary student={student} />
				<AreaOfStudySidebar student={student} />
			</section>
		)
	}
}

export default GraduationStatusContainer
