import React, { Component, PropTypes, cloneElement } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'

// import Sidebar from './sidebar'
import Loading from '../../../components/loading'
import getStudentCourses from '../../../helpers/get-student-courses'

import './student.scss'

export class Student extends Component {
	static propTypes = {
		content: PropTypes.node,  // from react-router
		isLoading: PropTypes.bool.isRequired,
		overlay: PropTypes.node,  // from react-router
		params: PropTypes.object,  // react-router
		sidebar: PropTypes.node,  // from react-router
		student: PropTypes.object,  // redux
	};

	state = {
		courses: [],
	};

	componentWillMount() {
		this.handleLoadStudent(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.handleLoadStudent(nextProps)
	}

	handleLoadStudent = props => {
		if (props.student) {
			getStudentCourses(props.student).then(courses => {
				this.setState({
					courses: courses,
				})
				return null
			})
		}
	};

	render() {
		console.log(this.props)

		if (this.props.isLoading){//} || !this.props.student) {
			return <Loading>Loading Student…</Loading>
		}

		const name = this.props.student ? this.props.student.present.name : 'Loading…'

		return (
			<DocumentTitle title={`${name} | Gobbldygook`}>
				<div className='student'>
					{/*<Sidebar></Sidebar>*/}
					{/*this.props.sidebar*/}
					{this.props.content}
					{/*this.props.overlay*/}
				</div>
			</DocumentTitle>
		)
	}
}


const mapStateToProps = (state, ownProps) => ({
	student: state.students.data[ownProps.params.id],
	isLoading: state.students.isLoading,
})

export default connect(mapStateToProps)(Student)
