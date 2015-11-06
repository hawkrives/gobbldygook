import React, {Component, PropTypes} from 'react'
import history from '../start-things/history'

import studentActions from '../flux/student-actions'
import studentStore from '../flux/student-store'

import Button from '../components/button'
import CourseSearcher from './course-searcher'
import GraduationStatus from './graduation-status'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

import './sidebar.scss'

export default class Sidebar extends Component {
	static propTypes = {
		allAreas: PropTypes.object, // Immutable.List
		baseSearchQuery: PropTypes.object,
		courses: PropTypes.object, // Immutable.List
		coursesLoaded: PropTypes.bool.isRequired,
		isSearching: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
		toggleSearchSidebar: PropTypes.func.isRequired,
	}

	static contextTypes = {
		router: PropTypes.func,
	}

	render() {
		return (
			<aside className='sidebar'>
				<Toolbar className='student-buttons'>
					<Button title='Students' onClick={() => history.pushState(null, '/')}>
							<Icon name='ios-people-outline' type='block' />
					</Button>
					<Button
						title='Search'
						onClick={this.props.toggleSearchSidebar}>
						<Icon name='ios-search' type='block' />
					</Button>

					<Separator type='spacer' />

					<Button
						title='Undo'
						onClick={studentActions.undo}
						disabled={studentStore.history.size === 0}>
						<Icon name={`ios-undo${studentStore.history.size === 0 ? '-outline' : ''}`} type='block' />
					</Button>
					<Button
						title='Redo'
						onClick={studentActions.redo}
						disabled={studentStore.future.size === 0}>
						<Icon name={`ios-redo${studentStore.future.size === 0 ? '-outline' : ''}`} type='block' />
					</Button>

					<Separator type='spacer' />

					<Button title='Download' onClick={() => history.pushState(null, `/s/${this.props.student.id}/download/`)}>
						<Icon name='ionicon-ios-download-outline' type='block' />
					</Button>
					<Button
						title='Revert to Demo'
						onClick={() => studentActions.resetStudentToDemo(this.props.student.id)}>
						<Icon name='ios-reload' type='block' />
					</Button>
				</Toolbar>

				<CourseRemovalBox studentId={this.props.student.id} />

				{!this.props.isSearching
					? <GraduationStatus
						allAreas={this.props.allAreas}
						courses={this.props.courses}
						coursesLoaded={this.props.coursesLoaded}
						isHidden={this.props.isSearching}
						student={this.props.student}
					/>
					: <CourseSearcher
						isHidden={!this.props.isSearching}
						toggle={this.props.toggleSearchSidebar}
						student={this.props.student}
						baseSearchQuery={this.props.baseSearchQuery}
					/>}
			</aside>
		)
	}
}
