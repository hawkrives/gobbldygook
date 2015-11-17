import React, {Component, PropTypes, cloneElement} from 'react'
import DocumentTitle from 'react-document-title'

import map from 'lodash/collection/map'
import filter from 'lodash/collection/filter'
import Sidebar from './sidebar'
import Loading from '../components/loading'

import './student.scss'

export default class Student extends Component {
	static propTypes = {
		allAreas: PropTypes.array,
		children: PropTypes.node,
		params: PropTypes.object, // react-router
		students: PropTypes.object,
	}

	static defaultProps = {
		allAreas: [],
		students: {},
	}

	constructor(props) {
		super(props)
		this.state = {
			allAreas: [],
			baseSearchQuery: {},
			courses: [],
			coursesLoaded: false,
			message: `Loading Student ${props.params.id}`,
			messageClass: '',
			isSearching: false,
			student: null,
		}
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props)
	}

	componentWillReceiveProps(nextProps) {
		// console.log(nextProps)
		const queryId = this.props.params.id
		const student = nextProps.students.get(queryId)

		if (student) {
			// console.info('student\'s student: ', student.toJS())
			window.stu = student
			this.setState({student})
			student.courses.then(courses => {
				this.setState({
					courses: courses,
					coursesLoaded: true,
				})
				return null
			})

			const customAreas = map(filter(student.studies, {isCustom: true}), study => study.data)

			Promise.all(customAreas).then(customAreas => {
				this.setState({
					allAreas: nextProps.allAreas.concat(customAreas),
				})
				return null
			})
		}
		else {
			this.setState({
				message: `Could not find student "${queryId}"`,
				messageClass: 'error',
			})
		}
	}

	toggleSearchSidebar = () => {
		this.setState({
			isSearching: !this.state.isSearching,
			baseSearchQuery: {},
		})
	}

	showSearchSidebar = ({schedule}) => {
		this.setState({
			isSearching: true,
			baseSearchQuery: {
				semester: [schedule.semester],
				year: [schedule.year],
			},
		})
	}

	render() {
		// console.info('Student#render')

		if (!this.state.student) {
			return <Loading className={this.state.messageClass}>{this.state.message}</Loading>
		}

		return (
			<DocumentTitle title={`${this.state.student.name} | Gobbldygook`}>
				<div className='student'>
					<Sidebar
						allAreas={this.state.allAreas}
						baseSearchQuery={this.state.baseSearchQuery}
						courses={this.state.courses}
						coursesLoaded={this.state.coursesLoaded}
						isSearching={this.state.isSearching}
						toggleSearchSidebar={this.toggleSearchSidebar}
						student={this.state.student}
					/>
					{cloneElement(this.props.children, {
						className: 'content',
						allAreas: this.state.allAreas,
						student: this.state.student,
						courses: this.state.courses,
						coursesLoaded: this.state.coursesLoaded,
						showSearchSidebar: this.showSearchSidebar,
					})}
				</div>
			</DocumentTitle>
		)
	}
}
