// @flow
import React from 'react'
import map from 'lodash/map'
import noop from 'lodash/noop'
import styled from 'styled-components'
import * as theme from '../../theme'
import {InlineList, InlineListItem} from '../../components/list'
import CourseTitle from './course-title'
import {buildDeptNum} from '@gob/school-st-olaf-college'
import CourseWarnings from './warnings'
import {to12HourTime} from '@gob/lib'
import type {Course} from '@gob/types'
import type {WarningType} from '@gob/object-student'

export const Container = styled.article`
	display: block;

	&:hover {
		cursor: pointer;
		background-color: ${theme.gray100};
	}

	&.is-dragging {
		opacity: 0.5;
	}
`

const Row = `
    overflow: hidden;
    line-height: 1.5;
`

export const Title = styled(CourseTitle)`
	${Row};
`

export const SummaryRow = styled.div`
	${Row};
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	font-size: 0.75em;

	& > * + *:not(:empty)::before {
		margin: 0 0.2em;
		content: '·';
	}
`

const GeReqItem = styled(InlineListItem)`
	& + &::before {
		margin: 0 0.2em;
		content: '+';
	}
`

const Identifier = styled.span`
	font-feature-settings: 'tnum';
`

const Type = styled.span``
const Prereqs = styled.span``

export type Props = {
	className?: string,
	conflicts?: Array<Array<?WarningType>>,
	course: Course,
	index?: number,
	onClick?: Event => any,
}

export default class CompactCourse extends React.Component<Props> {
	render() {
		const {course, conflicts, index, onClick = noop} = this.props

		return (
			<Container className={this.props.className} onClick={onClick}>
				{conflicts && (
					<CourseWarnings warnings={conflicts[index || 0]} />
				)}

				<Title
					title={course.title}
					name={course.name}
					type={course.type}
				/>

				<SummaryRow>
					<Identifier>{buildDeptNum(course, true)}</Identifier>
					{course.type !== 'Research' && <Type>{course.type}</Type>}
					{course.gereqs && (
						<InlineList>
							{map(course.gereqs, ge => (
								<GeReqItem key={ge}>{ge}</GeReqItem>
							))}
						</InlineList>
					)}
					{course.prerequisites && (
						<Prereqs title={course.prerequisites}>Prereq</Prereqs>
					)}
				</SummaryRow>
				<SummaryRow>
					{(course.offerings || []).map(({day, start, end}, i) => (
						<span key={i}>
							{day} {to12HourTime(start)}-{to12HourTime(end)}
						</span>
					))}
				</SummaryRow>
			</Container>
		)
	}
}
