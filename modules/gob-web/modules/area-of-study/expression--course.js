// @flow

import React from 'react'
import cx from 'classnames'
import {semesterName} from '@gob/school-st-olaf-college'

import './expression--course.scss'

type Props = {
	_result?: bool,
	_taken?: bool,
	department: string,
	international?: bool,
	lab?: bool,
	level?: number,
	number?: number,
	section?: string,
	semester?: number,
	style?: Object,
	type?: string,
	year?: number,
}

export default function CourseExpression(props: Props) {
	const department = props.department

	const international = props.international && (
		<span className="course--international">I</span>
	)
	const lab =
		props.lab ||
		(props.type === 'Lab' && <span className="course--lab">L</span>)

	const section = props.section &&
		props.section !== '*' && (
			<span className="course--section">[{props.section}]</span>
		)

	const year = props.year && (
		<span className="course--year">{props.year}</span>
	)
	const semester = props.semester && (
		<span className="course--semester">
			{props.semester === '*'
				? 'ANY'
				: semesterName(props.semester).toUpperCase()}
		</span>
	)

	/////

	const temporalIdentifiers = (semester || year) && (
		<div className="temporal">
			{semester}
			{year}
		</div>
	)

	return (
		<span
			className={cx('course', {
				matched: props._result,
				taken: props._taken,
			})}
			style={props.style}
		>
			<div className="basic-identifiers">
				<span className="course--department">{department}</span>
				<span>
					<span className="course--number">
						{props.number || String(props.level)[0] + 'XX'}
					</span>
					{international}
					{lab ? 'L' : null} {section}
				</span>
			</div>
			{temporalIdentifiers}
		</span>
	)
}
