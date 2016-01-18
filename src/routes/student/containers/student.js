import React, { Component, PropTypes, cloneElement } from 'react'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadStudent } from '../../../redux/students/actions/load-students'

// import Sidebar from './sidebar'
import Loading from '../../../components/loading'

import './student.scss'

export class Student extends Component {
	static propTypes = {
		content: PropTypes.node,  // from react-router
		isLoading: PropTypes.bool.isRequired,
		loadStudent: PropTypes.func.isRequired,
		overlay: PropTypes.node,  // from react-router
		params: PropTypes.object,  // react-router
		sidebar: PropTypes.node,  // from react-router
		student: PropTypes.object,  // redux
	};

	componentWillMount() {
		this.loadStudent(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.loadStudent(nextProps)
	}

	loadStudent = props => {
		if (!props.student || props.params.studentId !== this.props.params.studentId)  {
			props.loadStudent(props.params.studentId)
		}
	};

	render() {
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
	processed: state.processed[ownProps.params.id],
	isLoading: state.students.isLoading,
})

const mapDispatchToProps = dispatch =>
	bindActionCreators({loadStudent}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Student)
