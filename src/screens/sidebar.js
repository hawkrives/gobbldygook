import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import Student from '../models/student'
import studentActions from '../flux/student-actions'
import studentStore from '../flux/student-store'

import Button from '../components/button'
import CourseSearcher from './course-searcher'
import GraduationStatus from './graduation-status'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'

export default class Sidebar extends Component {
	static propTypes = {
		student: PropTypes.instanceOf(Student).isRequired,
	}

	constructor() {
		super()
		this.state = {
			isSearching: false,
		}
	}

	toggleSearch = () => {
		this.setState({isSearching: !this.state.isSearching})
	}

	render() {
		return (
			<aside className='sidebar'>
				<Toolbar className='student-buttons'>
					<Button className='sidebar-btn'>
						<Link to='/' >
							<Icon name='ionicon-ios-list-outline' type='block' />
							Students
						</Link>
					</Button>
					<Button className='sidebar-btn'
						onClick={this.toggleSearch}>
						<Icon name='ionicon-ios-search' type='block' />
						Search
					</Button>
					<Button className='sidebar-btn'>
						<Link to='download' params={{id: this.props.student.id}}>
							<Icon name='ionicon-ios-download-outline' type='block' />
							Download
						</Link>
					</Button>
					<Button className='sidebar-btn'
						onClick={() => studentActions.resetStudentToDemo(this.props.student.id)}>
						<Icon name='ionicon-ios-rose' type='block' />
						Demo
					</Button>
					<Button className='sidebar-btn'
						onClick={studentActions.undo}
						disabled={studentStore.history.size === 0}>
						<Icon name={`ionicon-ios-undo${studentStore.history.size === 0 ? '-outline' : ''}`} type='block' />
						Undo
					</Button>
					<Button className='sidebar-btn'
						onClick={studentActions.redo}
						disabled={studentStore.future.size === 0}>
						<Icon name={`ionicon-ios-redo${studentStore.future.size === 0 ? '-outline' : ''}`} type='block' />
						Redo
					</Button>
				</Toolbar>

				<GraduationStatus
					isHidden={this.state.isSearching}
					student={this.props.student} />

				<CourseSearcher
					isHidden={!this.state.isSearching}
					toggle={this.toggleSearch} />
			</aside>
		)
	}
}
