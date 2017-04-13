// @flow

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    changeName,
    changeMatriculation,
    changeGraduation,
} from '../../redux/students/actions/change'

import { StudentSummary } from './student-summary'

type Student = Object

class WrappedStudentSummary extends React.PureComponent {
    props: {
        changeGraduation: string => any,
        changeMatriculation: string => any,
        changeName: string => any,
        student: Student,
    }

    handleChangeGraduation = (value: string) => {
        const newGraduation = parseInt(value) || 0
        this.props.changeGraduation(this.props.student.id, newGraduation)
    }

    handleChangeMatriculation = (value: string) => {
        const newMatriculation = parseInt(value) || 0
        this.props.changeMatriculation(this.props.student.id, newMatriculation)
    }

    handleChangeName = (value: string) => {
        this.props.changeName(this.props.student.id, value)
    }

    render() {
        return (
            <StudentSummary
                onChangeGraduation={this.handleChangeGraduation}
                onChangeMatriculation={this.handleChangeMatriculation}
                onChangeName={this.handleChangeName}
                student={this.props.student}
            />
        )
    }
}

const mapDispatch = dispatch =>
    bindActionCreators(
        {
            changeName,
            changeMatriculation,
            changeGraduation,
        },
        dispatch
    )

// $FlowFixMe
export const ConnectedStudentSummary = connect(null, mapDispatch)(
    WrappedStudentSummary
)
