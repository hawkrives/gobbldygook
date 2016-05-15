import React, { Component, PropTypes } from 'react'
import map from 'lodash/map'
import InlineCourse from './inline-course'

import compareProps from 'src/helpers/compare-props'
import toPrettyTerm from 'src/helpers/to-pretty-term'
import expandYear from 'src/helpers/expand-year'
import semesterName from 'src/helpers/semester-name'

const GROUP_BY_TO_TITLE = {
	'Day of Week': days => days,
	'Department': depts => depts,
	'GenEd': gereqs => gereqs,
	'Semester': sem => semesterName(sem),
	'Term': term => toPrettyTerm(term),
	'Time of Day': times => times,
	'Year': year => expandYear(year),
	'None': () => '',
}

export default class CourseResultsList extends Component {
	static propTypes = {
		groupBy: PropTypes.string.isRequired,
		results: PropTypes.array.isRequired,
		sortBy: PropTypes.string,
		studentId: PropTypes.string,
	};

	shouldComponentUpdate(nextProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		// console.log('CourseResultsList.render')
		const { results, groupBy: groupByValue, studentId } = this.props

		return (
			<ul className='term-list'>
				{map(results, ([groupTitle, courses]) => {
					const title = GROUP_BY_TO_TITLE[groupByValue](groupTitle)
					return <li key={groupTitle} className='course-group'>
						{title && <p className='course-group-title'>{title}</p>}
						<ul className='course-list'>
							{map(courses, (course, index) =>
								<li key={index}>
									<InlineCourse course={course} studentId={studentId} />
								</li>)}
						</ul>
					</li>
				})}
			</ul>
		)
	}
}
