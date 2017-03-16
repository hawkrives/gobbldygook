// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import has from 'lodash/has'
import pathToOverride from '../../../examine-student/path-to-override'

import { addArea, removeArea } from '../../redux/students/actions/areas'
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
        allAreas: AreaOfStudy[], // redux
        removeArea: () => any, // redux
        removeOverride: () => any, // redux
        setOverride: () => any, // redux
        student: Student,
    };

    handleAddArea = (area: AreaOfStudy, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.addArea(this.props.student.id, area)
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

    handleRemoveArea = (areaQuery: any, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.removeArea(this.props.student.id, areaQuery)
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
                    allAreas={this.props.allAreas}
                    onAddArea={this.handleAddArea}
                    onAddOverride={this.handleAddOverride}
                    onRemoveArea={this.handleRemoveArea}
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
            addArea,
            setOverride,
            removeOverride,
            removeArea,
        },
        dispatch
    )

const mapState = state => ({ allAreas: state.areas.data })

// $FlowFixMe
export default connect(mapState, mapDispatch)(GraduationStatusContainer)
