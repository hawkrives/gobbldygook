import React from 'react'
import {Link} from 'react-router'
import Immutable from 'immutable'

import UndoButton from './undoButton'
import RedoButton from './redoButton'

import SearchButton from './searchButton'
import GraduationStatus from './graduationStatus'

import studentActions from '../flux/studentActions'

let Sidebar = React.createClass({
	propTypes: {
		student: React.PropTypes.instanceOf(Immutable.Record).isRequired,
	},

	toggleSearch() {
		this.setState({isSearching: !this.state.isSearching})
	},

	getInitialState() {
		return {
			isSearching: false,
		}
	},

	render() {
		console.log('Sidebar#render')
		let student = this.props.student

		let ActiveSidebarComponent = GraduationStatus
		let props = {student}
		if (this.state.isSearching) {
			ActiveSidebarComponent = SearchButton
			props.toggle = this.toggleSearch
		}

		let sidebar = <aside className='sidebar'>
			<menu className='student-buttons'>
				<Link to='/' className='back sidebar-btn'>Students</Link>
				<button className='search sidebar-btn' onClick={this.toggleSearch}>Search</button>
				<a className='sidebar-btn'
					download={`${student.name}.gb-student.json`}
					href={`data:text/json;charset=utf-8,${student.encode()}`}>
					Download
				</a>
				<button className='sidebar-btn'
					onClick={() => studentActions.resetStudentToDemo(student.id)}>
					Revert to Demo
				</button>
				<UndoButton className='sidebar-btn' />
				<RedoButton className='sidebar-btn' />
			</menu>
			<ActiveSidebarComponent {...props} />
		</aside>

		return sidebar
	},
})

export default Sidebar
