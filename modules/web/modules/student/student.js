import React, { Component, PropTypes, cloneElement } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadStudent } from '../../redux/students/actions/load-student'

import Sidebar from '../../components/sidebar'
import Loading from '../../components/loading'

import CourseTable from '../course-table'
import GraduationStatus from './graduation-status-container'

import './student.scss'

export class Student extends Component {
    static propTypes = {
        content: PropTypes.node, // from react-router
        loadStudent: PropTypes.func.isRequired,
        overlay: PropTypes.node,
        params: PropTypes.object, // react-router
        processed: PropTypes.object, // redux
        sidebar: PropTypes.node, // from react-router
        student: PropTypes.object, // redux
    };

    componentWillMount() {
        this.loadStudent(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.loadStudent(nextProps)
    }

    loadStudent = props => {
        if (
            !props.student ||
            props.params.studentId !== this.props.params.studentId
        ) {
            props.loadStudent(props.params.studentId)
        }
    };

    render() {
        if (!this.props.student) {
            return (
                <div>
                    Student {this.props.params.studentId} could not be loaded.
                </div>
            )
        }

        if (this.props.student.isLoading) {
            return <Loading>Loading Student…</Loading>
        }

        const name = this.props.student
            ? this.props.student.data.present.name
            : 'Loading…'

        const contentProps = {
            student: this.props.student,
            className: 'content',
        }
        const contents = this.props.content
            ? cloneElement(this.props.content, contentProps)
            : <CourseTable {...contentProps} />

        const sidebarProps = { student: this.props.student.data.present }
        const sidebar = this.props.sidebar
            ? cloneElement(this.props.sidebar, sidebarProps)
            : <GraduationStatus {...sidebarProps} />

        return (
            <DocumentTitle title={`${name} | Gobbldygook`}>
                <div className="student">
                    <Sidebar student={this.props.student}>
                        {sidebar}
                    </Sidebar>
                    {contents}
                    {this.props.overlay || null}
                </div>
            </DocumentTitle>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    student: state.students[ownProps.params.studentId],
})

const mapDispatchToProps = dispatch =>
    bindActionCreators({ loadStudent }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Student)
