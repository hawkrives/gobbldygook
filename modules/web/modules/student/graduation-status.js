// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import has from 'lodash/has'
import pathToOverride from '../../../examine-student/path-to-override'

import {
    changeName,
    changeMatriculation,
    changeGraduation,
} from '../../redux/students/actions/change'
import { addArea, removeArea } from '../../redux/students/actions/areas'
import {
    setOverride,
    removeOverride,
} from '../../redux/students/actions/overrides'
import AreaOfStudySidebar from './area-of-study-sidebar'
import StudentSummary from './student-summary'

import './graduation-status.scss'

type AreaOfStudy = Object;
type Student = Object;

class GraduationStatusContainer extends Component {
    props: {
        addArea: (string, AreaOfStudy) => any, // redux
        allAreas: AreaOfStudy[], // redux
        changeGraduation: () => any, // redux
        changeMatriculation: () => any, // redux
        changeName: () => any, // redux
        removeArea: () => any, // redux
        removeOverride: () => any, // redux
        setOverride: () => any, // redux
        student: Student,
    };

    state: {
        showAreaPickerFor: { [key: string]: boolean },
    } = {
        showAreaPickerFor: {},
    };

    handleInitiateAddArea = (type: string, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.setState(state => ({
            showAreaPickerFor: { ...state.showAreaPickerFor, [type]: true },
        }))
    };

    handleEndAddArea = (type: string, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.setState(state => ({
            showAreaPickerFor: { ...state.showAreaPickerFor, [type]: false },
        }))
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

    handleChangeGraduation = (ev: Event) => {
        if (!(ev.target instanceof HTMLInputElement)) {
            return
        }
        const newGraduation = parseInt(ev.target.value) || 0
        this.props.changeGraduation(this.props.student.id, newGraduation)
    };
    handleChangeMatriculation = (ev: Event) => {
        if (!(ev.target instanceof HTMLInputElement)) {
            return
        }
        const newMatriculation = parseInt(ev.target.value) || 0
        this.props.changeMatriculation(this.props.student.id, newMatriculation)
    };
    handleChangeName = (ev: Event) => {
        if (!(ev.target instanceof HTMLInputElement)) {
            return
        }
        this.props.changeName(this.props.student.id, ev.target.value)
    };

    render() {
        const student = this.props.student
        if (!student) {
            return null
        }

        return (
            <section className="graduation-status">
                <StudentSummary
                    onChangeGraduation={this.handleChangeGraduation}
                    onChangeMatriculation={this.handleChangeMatriculation}
                    onChangeName={this.handleChangeName}
                    student={student}
                />
                <AreaOfStudySidebar
                    allAreas={this.props.allAreas}
                    showAreaPickerFor={this.state.showAreaPickerFor}
                    onAddArea={this.handleAddArea}
                    onAddOverride={this.handleAddOverride}
                    onEndAddArea={this.handleEndAddArea}
                    onInitiateAddArea={this.handleInitiateAddArea}
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
            changeName,
            changeMatriculation,
            changeGraduation,
        },
        dispatch
    )

const mapState = state => ({ allAreas: state.areas.data })

// $FlowFixMe
export default connect(mapState, mapDispatch)(GraduationStatusContainer)
