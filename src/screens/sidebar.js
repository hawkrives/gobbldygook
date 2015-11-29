import React, {Component, PropTypes} from 'react'
import omit from 'lodash/object/omit'
import history from '../history'

import Button from '../components/button'
// import CourseSearcher from './course-searcher'
// import GraduationStatus from './graduation-status'
import Icon from '../components/icon'
import Toolbar from '../components/toolbar'
import Separator from '../components/separator'

import CourseRemovalBox from '../components/course-removal-box'

import './sidebar.scss'

export default class Sidebar extends Component {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		canRedo: PropTypes.bool.isRequired,
		canUndo: PropTypes.bool.isRequired,
		student: PropTypes.object.isRequired,
	}

	static contextTypes = {
		location: PropTypes.object,
	}

	goHome = () => {
		history.pushState(null, '/')
	}

	showShareSheet = () => {
		console.log(this.context.location.query)
		const query = {...this.context.location.query, share: true}
		console.log(query)
		history.pushState(null, this.context.location.pathname, query)
	}

	removeSearchQuery = () => {
		const query = omit(this.context.location.query, ['partialSearch', 'searchTerm'])
		history.pushState(null, this.context.location.pathname, query)
	}

	showSearchSidebar = () => {
		const query = {...this.context.location.query, searchTerm: ''}
		history.pushState(null, this.context.location.pathname, query)
	}

	render() {
		const { actions, canUndo, canRedo, student } = this.props
		const isSearching = 'partialSearch' in this.context.location.query || 'searchTerm' in this.context.location.query

		return (
			<aside className='sidebar'>
				<Toolbar className='student-buttons'>
					<Button title='Students' onClick={this.goHome}>
						<Icon name='ios-people-outline' type='block' />
					</Button>
					<Button title='Search' onClick={isSearching ? this.removeSearchQuery : this.showSearchSidebar}>
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

				<div>{isSearching ? 'Is searching!' : 'is not searching…'}</div>

				{/*!isSearching
					? <GraduationStatus isHidden={isSearching} />
					: <CourseSearcher isHidden={!isSearching} />*/}
			</aside>
		)
	}
}
