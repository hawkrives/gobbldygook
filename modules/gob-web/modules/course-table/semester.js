// @flow

import React from 'react'
import cx from 'classnames'
import {connect} from 'react-redux'
import {Link} from '@reach/router'
import {List, Map} from 'immutable'
import {countCredits} from '@gob/examine-student'
import {semesterName} from '@gob/school-st-olaf-college'
import {DropTarget} from 'react-dnd'
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
	type FabricationType,
} from '@gob/object-student'
import type {Course as CourseType, CourseError} from '@gob/types'
import {getOnlyCourse, getCourse} from '../../helpers/get-courses'
import {
	changeStudent,
	type ChangeStudentFunc,
} from '../../redux/students/actions/change'
import {CourseList} from './course-list'
import styled from 'styled-components'

const Container = styled.div`
	${theme.card};
	flex: 1 0;
	min-width: 14em;
	margin: var(--semester-spacing);
	overflow: hidden;

	&.can-drop {
		cursor: copy;
		box-shadow: 0 0 4px var(--gray-500);
		z-index: 10;
	}

	--background-color: var(--white);
	--background-color-hover: var(--gray-200);
	--separator-color: var(--gray-200);

	&.loading {
	}

	&.invalid {
		--background-color: var(--amber-50);
		--background-color-hover: var(--amber-100);
		--separator-color: var(--amber-100);
	}
`

const TitleButton = styled(FlatButton)`
	padding: var(--block-edge-padding) var(--semester-side-padding);
	min-height: 0;
	font-size: 0.9em;

	border: 0;
	border-radius: 0;
	transition: 0.15s;

	&:hover {
		background-color: var(--background-color-hover, var(--gray-100));
	}

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
	border-bottom: solid 1px var(--separator-color, #eaeaea);

	font-size: 0.85em;

	display: flex;
	flex-flow: row nowrap;
	align-items: stretch;
	color: var(--header-fg-color, --gray-500);

	overflow: hidden;

	padding-left: var(--semester-side-padding);
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
	padding: var(--block-edge-padding) 0;
	padding-right: var(--semester-side-padding);

	&:hover {
		text-decoration: underline;
	}
`

const TitleText = styled.h1`
	${theme.headingNeutral};
	display: inline-block;
	color: black;
`

type DnDProps = {
	canDrop?: boolean,
	connectDropTarget: Function,
	isOver: boolean,
}

type ReduxProps = {
	changeStudent: ChangeStudentFunc,
}

type ReactProps = {
	schedule: Schedule,
	semester: number,
	student: Student,
	year: number,
}

type Props = ReduxProps & DnDProps & ReactProps

type State = {
	loading: boolean,
	checking: boolean,
	courses: List<CourseType | FabricationType | CourseError>,
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
		this.prepare(this.props)
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.schedule !== prevProps.schedule) {
			this.prepare(this.props)
		}
	}

	prepare = async props => {
		this.setState(() => ({loading: true, checking: true}))

		let {schedule} = props
		let courses = await schedule.getCourses(
			getCourse,
			props.student.fabrications,
		)
		let credits = countCredits([...courses])

		this.setState(() => ({courses, credits, loading: false}))

		let {warnings, hasConflict} = await schedule.validate(getOnlyCourse)

		this.setState(() => ({warnings, hasConflict, checking: false}))
	}

	removeSemester = () => {
		const {student, semester, year} = this.props
		let s = student.destroySchedulesForTerm({year, semester})
		this.props.changeStudent(s)
	}

	render() {
		let props = this.props
		let {student, semester, year, canDrop} = props

		let schedule = this.props.schedule
		let {courses, credits, warnings, hasConflict, loading} = this.state

		let {recommendedCredits} = schedule
		let creditsPerCourse = 1
		let recommendedSlots = creditsPerCourse * recommendedCredits

		if (loading) {
			recommendedSlots = 0
		}

		const infoBar = []
		if (courses.size) {
			// prettier-ignore
			infoBar.push(`${courses.size} ${courses.size === 1 ? 'course' : 'courses'}`)

			// prettier-ignore
			infoBar.push(`${credits} ${credits === 1 ? 'credit' : 'credits'}`)
		}

		if (loading) {
			infoBar.unshift('Loading…')
		}

		const className = cx('semester', {
			invalid: hasConflict,
			'can-drop': canDrop,
			loading: loading,
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
						to={`/student/${
							student.id
						}/search?term=${year}${semester}`}
						title="Search for courses"
					>
						<Icon>{search}</Icon> Course
					</TitleButton>

					<RemoveSemesterButton
						onClick={this.removeSemester}
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
	drop(props: ReactProps & ReduxProps, monitor) {
		let {clbid, fromScheduleId, isFromSchedule} = monitor.getItem()
		let {student, schedule} = props

		if (isFromSchedule) {
			let s = student.moveCourseToSchedule({
				from: fromScheduleId,
				to: schedule.id,
				clbid,
			})
			props.changeStudent(s)
		} else {
			let s = student.addCourseToSchedule(schedule.id, clbid)
			props.changeStudent(s)
		}
	},
	canDrop(props: ReactProps, monitor) {
		let item = monitor.getItem()
		let hasClbid = props.schedule.clbids.includes(item.clbid)
		return !hasClbid
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

const connected = connect(
	undefined,
	{changeStudent},
)(droppable)

export default connected
