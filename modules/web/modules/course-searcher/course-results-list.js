// @flow
import React, { Component } from 'react'
import map from 'lodash/map'
import InlineCourse from '../course/inline-course'
import debug from 'debug'
const log = debug('web:react')

import { compareProps } from '../../../lib'
import { toPrettyTerm, expandYear, semesterName } from '../../../school-st-olaf-college/course-info'

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

type CourseResultsListProps = {
	groupBy: string,
	results: any[],
	sortBy?: string,
	studentId?: string,
};

export default class CourseResultsList extends Component {
	props: CourseResultsListProps;

	shouldComponentUpdate(nextProps: CourseResultsListProps) {
		return compareProps(this.props, nextProps)
	}

	render() {
		log('CourseResultsList.render')
		const { results, groupBy: groupByValue, studentId } = this.props

		return (
			<ul className="term-list">
				{map(results, ([groupTitle, courses]) => {
					const title = GROUP_BY_TO_TITLE[groupByValue](groupTitle)
					return <li key={groupTitle} className="course-group">
						{title && <p className="course-group-title">{title}</p>}
						<ul className="course-list">
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
