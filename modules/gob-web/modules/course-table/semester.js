// @flow

import React from 'react'
import cx from 'classnames'
import {Link} from '@reach/router'
import {semesterName} from '@gob/school-st-olaf-college'
import {countCredits} from '@gob/examine-student'
import {IDENT_COURSE} from '@gob/object-student'
import {DropTarget} from 'react-dnd'
import includes from 'lodash/includes'
import * as theme from '../../theme'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {InlineList, InlineListItem} from '../../components/list'
import {close, search} from '../../icons/ionicons'
import type {HydratedScheduleType} from '@gob/object-student'
import type {Course as CourseType} from '@gob/types'

import CourseList from './course-list'
import styled from 'styled-components'

const Container = styled.div`
	${theme.card};
	flex: 1 0;
	min-width: 16em;
	margin: var(--semester-spacing);

	&.can-drop {
		cursor: copy;
		box-shadow: 0 0 4px var(--gray-500);
		z-index: 10;
	}
`

const TitleButton = styled(FlatButton)`
	padding: var(--block-edge-padding) var(--semester-side-padding);
	min-height: 0;
	font-size: 0.9em;

	border: 0;
	border-radius: 0;
	transition: 0.15s;

	& + & {
		margin-left: 0.1em;
	}
`

const RemoveSemesterButton = styled(TitleButton)`
	&:hover {
		color: var(--red-500);
		border-color: var(--red-500);
		background-color: var(--red-50);
	}
`

const Header = styled.header`
	border-bottom: ${theme.materialDivider};

	font-size: 0.85em;

	display: flex;
	flex-flow: row nowrap;
	align-items: stretch;
	border-top-right-radius: 2px;
	border-top-left-radius: 2px;
	color: var(--gray-500);

	overflow: hidden;
`

const InfoList = styled(InlineList)`
	font-size: 0.8em;
`

const InfoItem = styled(InlineListItem)`
	font-variant-numeric: oldstyle-nums;

	& + &::before {
		content: ' – ';
		padding-left: 0.25em;
	}
`

const Title = styled(Link)`
	${theme.linkUndecorated};
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: var(--block-edge-padding) var(--semester-side-padding);

	&:hover {
		text-decoration: underline;
	}
`

const TitleText = styled.h1`
	${theme.headingNeutral};
	display: inline-block;
	color: black;
`

// TODO: fix up types here
type Props = {
	addCourse: Function, // redux
	canDrop: boolean,
	connectDropTarget: Function,
	isOver: boolean,
	moveCourse: Function, // redux
	removeSemester: Function,
	schedule: HydratedScheduleType,
	semester: number,
	studentId: string,
	year: number,
}

function Semester(props: Props) {
	let {studentId, semester, year, canDrop, schedule} = props
	let {courses, conflicts, hasConflict} = schedule

	// `recommendedCredits` is 4 for fall/spring and 1 for everything else
	let creditsPerCourse = 1
	let recommendedCredits = semester === 1 || semester === 3 ? 4 : 1
	let recommendedSlots = creditsPerCourse * recommendedCredits

	let onlyCourses: Array<CourseType> = ((courses || []).filter(
		(c: any) => c && !c.error,
	): Array<any>)
	let currentCredits = countCredits(onlyCourses)

	const infoBar = []
	if (schedule && courses && courses.length) {
		let courseCount = courses.length

		infoBar.push(
			<InfoItem key="course-count">
				{courseCount} {courseCount === 1 ? 'course' : 'courses'}
			</InfoItem>,
		)
		currentCredits &&
			infoBar.push(
				<InfoItem key="credit-count">
					{currentCredits}{' '}
					{currentCredits === 1 ? 'credit' : 'credits'}
				</InfoItem>,
			)
	}

	const className = cx('semester', {
		invalid: hasConflict,
		'can-drop': canDrop,
	})

	let name = semesterName(semester)

	return (
		<Container
			className={className}
			ref={ref => props.connectDropTarget(ref)}
		>
			<Header>
				<Title
					to={`term/${year}${semester}`}
					title={`Details for ${name}`}
				>
					<TitleText>{name}</TitleText>
					<InfoList>{infoBar}</InfoList>
				</Title>

				<TitleButton
					as={Link}
					to={`./?search&term=${year}${semester}`}
					title="Search for courses"
				>
					<Icon>{search}</Icon> Course
				</TitleButton>

				<RemoveSemesterButton
					onClick={props.removeSemester}
					title={`Remove ${year} ${name}`}
				>
					<Icon>{close}</Icon>
				</RemoveSemesterButton>
			</Header>

			{schedule && (
				<CourseList
					courses={courses || []}
					usedSlots={currentCredits / creditsPerCourse}
					maxSlots={recommendedSlots / creditsPerCourse}
					studentId={studentId}
					schedule={schedule}
					conflicts={conflicts || []}
				/>
			)}
		</Container>
	)
}

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor) {
		const item = monitor.getItem()
		const {clbid, fromScheduleId, isFromSchedule} = item
		const toSchedule = props.schedule

		if (isFromSchedule) {
			props.moveCourse(
				props.studentId,
				fromScheduleId,
				toSchedule.id,
				clbid,
			)
		} else {
			props.addCourse(props.studentId, toSchedule.id, clbid)
		}
	},
	canDrop(props, monitor) {
		const item = monitor.getItem()
		return !includes(props.schedule.clbids, item.clbid)
	},
}

// Specifies the props to inject into your component.
function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}
}

const droppable = DropTarget(IDENT_COURSE, semesterTarget, collect)(Semester)

export default droppable
