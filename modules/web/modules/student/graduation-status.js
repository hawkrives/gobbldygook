// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import has from 'lodash/has'
import pathToOverride from '../../../examine-student/path-to-override'

import {
    setOverride,
    removeOverride,
} from '../../redux/students/actions/overrides'
import { AreaOfStudySidebar } from './area-of-study-sidebar'
import { ConnectedStudentSummary } from './connected-student-summary'

import './graduation-status.scss'

type AreaOfStudy = Object;
type Student = Object;

class GraduationStatusContainer extends Component {
    props: {
        addArea: (string, AreaOfStudy) => any, // redux
        removeArea: () => any, // redux
        removeOverride: () => any, // redux
        setOverride: () => any, // redux
        student: Student,
    };

    handleAddOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)
        this.props.setOverride(this.props.student.id, codifiedPath, true)
    };

    handleRemoveOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)
        this.props.setOverride(this.props.student.id, codifiedPath)
    };

    handleToggleOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)

        if (has(this.props.student.overrides, codifiedPath)) {
            this.props.removeOverride(this.props.student.id, codifiedPath)
        } else {
            this.props.setOverride(this.props.student.id, codifiedPath, true)
        }
    };

    render() {
        const student = this.props.student
        if (!student) {
            return null
        }

        return (
            <section className="graduation-status">
                <ConnectedStudentSummary student={student} />
                <AreaOfStudySidebar
                    onAddOverride={this.handleAddOverride}
                    onRemoveOverride={this.handleRemoveOverride}
                    onToggleOverride={this.handleToggleOverride}
                    student={student}
                />
            </section>
        )
    }
}

const mapDispatch = dispatch =>
    bindActionCreators(
        {
            setOverride,
            removeOverride,
        },
        dispatch
    )

// $FlowFixMe
export default connect(null, mapDispatch)(GraduationStatusContainer)
