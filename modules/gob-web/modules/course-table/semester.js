// @flow

import React from 'react'
import cx from 'classnames'
import {Link} from '@reach/router'
import {List, Map} from 'immutable'
import {countCredits} from '@gob/examine-student'
import {semesterName} from '@gob/school-st-olaf-college'
import {DropTarget} from 'react-dnd'
import includes from 'lodash/includes'
import * as theme from '../../theme'
import {FlatButton} from '../../components/button'
import {Icon} from '../../components/icon'
import {InlineList, InlineListItem} from '../../components/list'
import {close, search} from '../../icons/ionicons'
import {
	IDENT_COURSE,
	Student,
	Schedule,
	type WarningType,
} from '@gob/object-student'
import type {Course as CourseType} from '@gob/types'
import {getOnlyCourse} from '../../helpers/get-courses'

import {CourseList} from './course-list'
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
	canDrop: boolean,
	connectDropTarget: Function,
	isOver: boolean,
	schedule: Schedule,
	semester: number,
	studentId: string,
	year: number,
	student: Student,
}

type State = {
	loading: boolean,
	checking: boolean,
	courses: List<CourseType>,
	warnings: Map<string, List<?WarningType>>,
	hasConflict: boolean,
	credits: number,
}

class Semester extends React.Component<Props, State> {
	state = {
		loading: true,
		checking: true,
		courses: List(),
		warnings: Map(),
		hasConflict: false,
		credits: 0,
	}

	componentDidMount() {
		this.prepare()
	}

	prepare = async () => {
		this.setState(() => ({loading: true, checking: true}))

		let {schedule} = this.props
		let courses = await schedule.getOnlyCourses(getOnlyCourse)
		let credits = countCredits([...courses])

		this.setState(() => ({courses, credits, loading: false}))

		let {warnings, hasConflict} = await schedule.validate(getOnlyCourse)

		this.setState(() => ({warnings, hasConflict, checking: false}))
	}

	removeSemester = () => {
		const {student, semester, year} = this.props
		student.destroySchedulesForTerm({year, semester})
	}

	render() {
		let props = this.props
		let {student, semester, year, canDrop} = props

		let schedule = this.props.schedule
		let {courses, credits, warnings, hasConflict} = this.state

		let {recommendedCredits} = schedule
		let creditsPerCourse = 1
		let recommendedSlots = creditsPerCourse * recommendedCredits

		const infoBar = []
		if (courses.size) {
			// prettier-ignore
			infoBar.push(`${courses.size} ${courses.size === 1 ? 'course' : 'courses'}`)

			// prettier-ignore
			infoBar.push(`${credits} ${credits === 1 ? 'credit' : 'credits'}`)
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
						to={`./term/${year}${semester}`}
						title={`Details for ${name}`}
					>
						<TitleText>{name}</TitleText>
						<InfoList>
							{infoBar.map(item => (
								<InfoItem key={item}>{item}</InfoItem>
							))}
						</InfoList>
					</Title>

					<TitleButton
						as={Link}
						to={`./search?term=${year}${semester}`}
						title="Search for courses"
					>
						<Icon>{search}</Icon> Course
					</TitleButton>

					<RemoveSemesterButton
						onClick={() =>
							student.destroySchedulesForTerm({year, semester})
						}
						title={`Remove ${year} ${name}`}
					>
						<Icon>{close}</Icon>
					</RemoveSemesterButton>
				</Header>

				{schedule && (
					<CourseList
						courses={[...courses]}
						usedSlots={credits / creditsPerCourse}
						maxSlots={recommendedSlots / creditsPerCourse}
						warnings={warnings}
						scheduleId={schedule.id}
						studentId={student.id}
					/>
				)}
			</Container>
		)
	}
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
