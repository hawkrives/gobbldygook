import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Link from 'react-router/lib/Link'
import {semesterName} from '@gob/school-st-olaf-college'
import {countCredits} from '@gob/examine-student'
import {IDENT_COURSE} from '@gob/object-student'
import {DropTarget} from 'react-dnd'
import includes from 'lodash/includes'
import * as theme from '../../theme'
import {FlatLinkButton} from '../../components/button'
import Icon from '../../components/icon'
import {InlineList, InlineListItem} from '../../components/list'
import {close, search} from '../../icons/ionicons'

import debug from 'debug'
const log = debug('web:react')

import CourseList from './course-list'
import styled from 'styled-components'

const Container = styled.div`
	${theme.card};
	flex: 1 0;
	min-width: 16em;
	margin: ${theme.semesterSpacing};

	&.can-drop {
		cursor: copy;
		box-shadow: 0 0 4px ${theme.gray500};
		z-index: 10;
	}
`

const TitleButton = FlatLinkButton.extend`
	${theme.semesterPadding};
	min-height: 0;
	font-size: 0.9em;

	border: 0;
	border-radius: 0;
	transition: 0.15s;

	& + & {
		margin-left: 0.1em;
	}
`

const RemoveSemesterButton = TitleButton.extend`
	&:hover {
		color: ${theme.red500};
		border-color: ${theme.red500};
		background-color: ${theme.red50};
	}
`

const Header = styled.header`
	border-bottom: ${theme.materialDivider};

	font-size: 0.85em;

	display: flex;
	flex-flow: row nowrap;
	align-items: stretch;
	font-feature-settings: 'smcp';
	border-top-right-radius: 2px;
	border-top-left-radius: 2px;
	color: ${theme.gray500};

	overflow: hidden;
`

const InfoList = InlineList.extend`
	font-size: 0.8em;
`

const InfoItem = InlineListItem.extend`
	font-feature-settings: 'onum';

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
	${theme.semesterPadding};

	&:hover {
		text-decoration: underline;
	}
`

const TitleText = styled.h1`
	${theme.headingNeutral};
	display: inline-block;
	color: black;
`

function Semester(props) {
	const {studentId, semester, year, canDrop, schedule} = props
	const {courses, conflicts, hasConflict} = schedule

	// `recommendedCredits` is 4 for fall/spring and 1 for everything else
	const recommendedCredits = semester === 1 || semester === 3 ? 4 : 1
	const currentCredits = courses && courses.length ? countCredits(courses) : 0

	const infoBar = []
	if (schedule && courses && courses.length) {
		const courseCount = courses.length

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

	return (
		<Container
			className={className}
			innerRef={ref => props.connectDropTarget(ref)}
		>
			<Header>
				<Title to={`/s/${studentId}/semester/${year}/${semester}`}>
					<TitleText>{semesterName(semester)}</TitleText>
					<InfoList>{infoBar}</InfoList>
				</Title>

				<TitleButton
					to={`/s/${studentId}/search/${year}/${semester}`}
					title="Search for courses"
				>
					<Icon>{search}</Icon> Course
				</TitleButton>

				<RemoveSemesterButton
					onClick={props.removeSemester}
					title={`Remove ${year} ${semesterName(semester)}`}
				>
					<Icon>{close}</Icon>
				</RemoveSemesterButton>
			</Header>

			{schedule ? (
				<CourseList
					courses={courses || []}
					creditCount={currentCredits}
					availableCredits={recommendedCredits}
					studentId={studentId}
					schedule={schedule}
					conflicts={conflicts || []}
				/>
			) : null}
		</Container>
	)
}

Semester.propTypes = {
	addCourse: PropTypes.func.isRequired, // redux
	canDrop: PropTypes.bool.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	isOver: PropTypes.bool.isRequired,
	moveCourse: PropTypes.func.isRequired, // redux
	removeSemester: PropTypes.func.isRequired,
	schedule: PropTypes.object.isRequired,
	semester: PropTypes.number.isRequired,
	studentId: PropTypes.string.isRequired,
	year: PropTypes.number.isRequired,
}

// Implements the drag source contract.
const semesterTarget = {
	drop(props, monitor) {
		log('dropped course')
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
