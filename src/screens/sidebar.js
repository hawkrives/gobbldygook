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
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

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
					<Button className='sidebar-btn' title='Students'>
						<Link to='/' >
							<Icon name='ionicon-ios-list-outline' type='block' />
						</Link>
					</Button>
					<Button className='sidebar-btn'
						title='Search'
						onClick={this.toggleSearch}>
						<Icon name='ionicon-ios-search' type='block' />
					</Button>

					<Separator type='spacer' />

					<Button className='sidebar-btn'
						title='Undo'
						onClick={studentActions.undo}
						disabled={studentStore.history.size === 0}>
						<Icon name={`ionicon-ios-undo${studentStore.history.size === 0 ? '-outline' : ''}`} type='block' />
					</Button>
					<Button className='sidebar-btn'
						title='Redo'
						onClick={studentActions.redo}
						disabled={studentStore.future.size === 0}>
						<Icon name={`ionicon-ios-redo${studentStore.future.size === 0 ? '-outline' : ''}`} type='block' />
					</Button>

					<Separator type='spacer' />

					<Button className='sidebar-btn' title='Download'>
						<Link to='download' params={{id: this.props.student.id}}>
							<Icon name='ionicon-ios-download-outline' type='block' />
						</Link>
					</Button>
					<Button className='sidebar-btn'
						title='Revert to Demo'
						onClick={() => studentActions.resetStudentToDemo(this.props.student.id)}>
						<Icon name='ionicon-ios-rose' type='block' />
					</Button>
				</Toolbar>

				<CourseRemovalBox studentId={this.props.student.id} />

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
