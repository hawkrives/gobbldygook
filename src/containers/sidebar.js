import React, {Component, PropTypes} from 'react'
import omit from 'lodash/object/omit'

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
		actions: PropTypes.object.isRequired,
		areas: PropTypes.array.isRequired,
		canRedo: PropTypes.bool.isRequired,
		canUndo: PropTypes.bool.isRequired,
		courses: PropTypes.array.isRequired,
		student: PropTypes.object.isRequired,
	};

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired,
	};

	goHome = () => {
		this.context.router.push('/')
	};

	showShareSheet = () => {
		const query = {...this.context.location.query, share: null}
		this.context.router.push({pathname: this.context.location.pathname, query})
	};

	closeSearcher = () => {
		const query = omit(this.context.location.query, ['partialSearch', 'search'])
		this.context.router.push({pathname: this.context.location.pathname, query})
	};

	openSearcher = () => {
		const query = {...this.context.location.query, search: null}
		this.context.router.push({pathname: this.context.location.pathname, query})
	};

	render() {
		const { actions, canUndo, canRedo, student, courses, areas } = this.props
		const isSearching = 'partialSearch' in this.context.location.query || 'search' in this.context.location.query

		return (
			<aside className='sidebar'>
				<Toolbar className='student-buttons'>
					<Button title='Students' onClick={this.goHome}>
						<Icon name='ios-people-outline' type='block' />
					</Button>
					<Button title='Search' onClick={isSearching ? this.closeSearcher : this.openSearcher}>
						<Icon name='ios-search' type='block' />
					</Button>

					<Separator type='spacer' />

					<Button title='Undo' onClick={actions.undo} disabled={!canUndo}>
						<Icon name={`ios-undo${!canUndo ? '-outline' : ''}`} type='block' />
					</Button>
					<Button title='Redo' onClick={actions.redo} disabled={!canRedo}>
						<Icon name={`ios-redo${!canRedo ? '-outline' : ''}`} type='block' />
					</Button>

					<Separator type='spacer' />

					<Button title='Share' onClick={this.showShareSheet}>
						<Icon name='ios-upload-outline' type='block' />
					</Button>
				</Toolbar>

				<CourseRemovalBox studentId={student.id} actions={actions} />

				{!isSearching
					? <GraduationStatus
						{...{actions, student, courses, areas}}
						isHidden={isSearching}
					/>
					: <CourseSearcher
						{...{actions, student}}
						isHidden={!isSearching}
						closeSearcher={this.closeSearcher}
					/>}
			</aside>
		)
	}
}
