// @flow
import React from 'react'

import { AreaOfStudySidebar } from './area-of-study-sidebar'
import { ConnectedStudentSummary } from './connected-student-summary'

import './graduation-status.scss'

type Student = Object

export default class GraduationStatusContainer extends React.PureComponent {
    props: {
        student: Student,
    }

    render() {
        const student = this.props.student
        if (!student) {
            return null
        }

        return (
            <section className="graduation-status">
                <ConnectedStudentSummary student={student} />
                <AreaOfStudySidebar student={student} />
            </section>
        )
    }
}
