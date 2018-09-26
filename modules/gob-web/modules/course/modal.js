// @flow
import React from 'react'
import noop from 'lodash/noop'
import styled, {css} from 'styled-components'
import Modal from '../../components/modal'
import {FlatButton, RaisedButton} from '../../components/button'
import SemesterSelector from './semester-selector'
import CompactCourse from './compact'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import oxford from 'listify'
import {
	addCourse,
	moveCourse,
	removeCourse,
} from '../../redux/students/actions/courses'
import * as theme from '../../theme'
import type {Course as CourseType, Offering} from '@gob/types'
import {BulletedList, PlainList, ListItem} from '../../components/list'
import {consolidateOfferings} from './offerings'

const ModalContainer = styled(Modal)`
	padding: 2rem 2rem;
	margin: 2rem 0;

	max-width: 80rem;

	display: grid;

	grid-template-areas:
		'course information picker'
		'course schedule picker';
	grid-template-columns: 300px 1.5fr 1fr;
	grid-template-rows: 1fr 1fr;

	grid-gap: 1em;

	&:focus {
		outline: 0;
	}
`

const Card = styled.div`
	${theme.baseCard};
	border: 1px solid;
	border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

const Toolbar = styled.div`
	padding: 0 20px;
	border-bottom: ${theme.materialDivider};
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	margin-bottom: 1em;

	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: center;
`

const RemoveCourseButton = styled(FlatButton)`
	color: ${theme.red500};
	padding-left: 0.5em;
	padding-right: 0.5em;
	font-size: 0.85em;

	&:hover {
		background-color: ${theme.red50};
		border-color: ${theme.red500};
	}
`

const GridArea = styled.div`
	${({area}) =>
		area &&
		css`
			grid-area: ${area};
		`};
	${({column}) =>
		column &&
		css`
			grid-column: ${column};
		`};
	${({row}) =>
		row &&
		css`
			grid-row: ${row};
		`};
`

const Course = styled(CompactCourse)``

const Columns = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr;
	grid-gap: 1em;

	padding-left: 1em;
	padding-right: 1em;
`

const Column = styled.div``

const Row = styled.div`
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
`

const CloseButton = styled(RaisedButton)`
	position: absolute;
	top: 2rem;
	right: 2rem;
`

const Description = styled.div`
	hyphens: none;
	margin-bottom: 1em;
`

const Heading = styled.h2`
	font-weight: 500;
	font-variant-caps: small-caps;
	font-size: 1em;
	margin-bottom: 0;
`

const Pill = styled.span`
	display: inline-block;
	padding: 0.15em 0.45em;
	border-radius: 1em;

	font-size: 0.8em;

	--fg: var(--green-900);
	background-color: var(--green-50);
	border: solid 1px var(--fg);
	color: var(--fg);

	& + & {
		margin-left: 1em;
	}
`

const Notice = styled.p`
	padding: 1em 0.85em;
	border-radius: 0.5em;
	margin: 0 1em;

	font-size: 0.8em;

	--fg: var(--blue-800);
	background-color: var(--blue-100);
	border: solid 1px var(--fg);
	color: var(--fg);

	& + & {
		margin-top: 1em;
	}
`

const InlineList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;

	& > li {
		display: inline-block;
	}
`

const TileBlock = styled.div`
	background: var(--bg, white);
	color: var(--fg, black);
	border: solid 1px var(--fg, black);

	border-radius: 0.5em;

	display: grid;
	grid-template-columns: min-content 1fr;
	grid-template-rows: min-content min-content;
	align-items: center;

	grid-row-gap: 0.25em;
`

const TileLabel = styled.div`
	grid-column: 1;
	grid-row: 1 / -1;

	border-right: solid 1px currentColor;

	padding: 0.5rem;
	font-size: 1.5em;
	font-weight: 400;

	display: flex;
	height: 100%;
	align-items: center;
`

const TileChunk = styled.div`
	grid-column: 2;
	padding: 0.5em;

	${({toStart}) =>
		toStart &&
		css`
			padding-block-start: 0;
			align-self: flex-start;
		`};
	${({toEnd}) =>
		toEnd &&
		css`
			padding-block-end: 0;
			align-self: flex-end;
		`};
`

const Grid = styled.div`
	display: grid;
	${({columns}) =>
		css`
			grid-template-columns: repeat(1fr, ${columns});
		`};
`

const TileGrid = styled.div`
	display: grid;
	grid-template-columns: max-content 1fr;
	align-items: center;
	column-gap: 1em;
	row-gap: 1em;

	font-size: 0.8em;
`

const TileGridLabel = styled.span`
	grid-column: 1;
	justify-content: flex-end;
	display: flex;
`

const TileColors = {
	section: {'--fg': 'var(--pink-900)', '--bg': 'var(--pink-50)'},
	lab: {'--fg': 'var(--green-900)', '--bg': 'var(--green-50)'},
}

function Tile(props: {
	section?: string,
	instructors: Array<string>,
	offerings?: Array<Offering>,
	colorSet?: $Keys<typeof TileColors>,
}) {
	let {section, instructors, offerings = [], colorSet} = props

	let colors = colorSet ? TileColors[colorSet] : {}

	return (
		<TileBlock style={colors}>
			{section && <TileLabel>{section}</TileLabel>}

			<TileChunk style={{fontWeight: '500'}} toEnd>
				{oxford(instructors)}
			</TileChunk>
			{offerings && (
				<TileChunk toStart>
					{consolidateOfferings(offerings).map(off => (
						<div key={off}>{off}</div>
					))}
				</TileChunk>
			)}
		</TileBlock>
	)
}

const removeFromSemester = ({
	studentId,
	removeCourse,
	clbid,
	scheduleId,
}: {
	studentId: ?string,
	removeCourse: Function,
	clbid: ?string,
	scheduleId: ?string,
}) => () => {
	if (studentId && scheduleId && clbid !== null && clbid !== undefined) {
		removeCourse(studentId, scheduleId, clbid)
	}
}

type Props = {
	addCourse?: () => any, // redux
	course: CourseType, // parent
	moveCourse?: () => any, // redux
	onClose: () => any, // parent
	removeCourse?: (string, string, string) => any, // redux
	scheduleId?: string, // parent
	student?: Object, // redux
	studentId?: string, // parent
}

function ModalCourse(props: Props) {
	const {
		course,
		student,
		studentId,
		scheduleId,
		removeCourse = noop,
		addCourse = noop,
		moveCourse = noop,
		onClose,
	} = props

	let showToolbar = scheduleId || student
	let removeCourseCallback = removeFromSemester({
		studentId,
		removeCourse,
		clbid: course.clbid,
		scheduleId,
	})

	return (
		<ModalContainer
			inheritStyles={false}
			onClose={onClose}
			contentLabel="Course Information"
		>
			<CloseButton onClick={onClose}>Close</CloseButton>

			<GridArea area="course">
				<Card>
					<Course course={course} />
				</Card>
			</GridArea>

			<GridArea area="information">
				<Card>
					{showToolbar && (
						<Toolbar>
							<SemesterSelector
								scheduleId={scheduleId}
								student={student}
								moveCourse={moveCourse}
								addCourse={addCourse}
								removeCourse={removeCourse}
								clbid={course.clbid}
							/>
							<RemoveCourseButton onClick={removeCourseCallback}>
								Remove Course
							</RemoveCourseButton>
						</Toolbar>
					)}

					{course.notes &&
						course.notes.map((note, i) => (
							<Notice key={i}>{note}</Notice>
						))}

					<Columns>
						<Column>
							{course.description && (
								<Description>
									<p>{course.description}</p>
								</Description>
							)}

							<p>
								{course.credits || 0} credit
								{course.credits === 1 ? '' : 's'}.
							</p>

							<TileGrid>
								<TileGridLabel>Section:</TileGridLabel>

								<GridArea column={2}>
									<Tile
										colorSet="section"
										section={course.section}
										instructors={course.instructors}
										offerings={course.offerings}
									/>
								</GridArea>

								<TileGridLabel>Lab:</TileGridLabel>

								<GridArea column={2}>
									<Tile
										colorSet="lab"
										section={course.section}
										instructors={course.instructors}
										offerings={course.offerings}
									/>
								</GridArea>
							</TileGrid>
						</Column>

						<Column>
							{course.prerequisites && (
								<>
									<Heading>Prerequisites</Heading>
									<p>{course.prerequisites}</p>
								</>
							)}

							{course.gereqs && (
								<>
									<Heading>G.E. Requirements</Heading>
									<InlineList>
										{course.gereqs.map(ge => (
											<Pill key={ge} as="li">
												{ge}
											</Pill>
										))}
									</InlineList>
								</>
							)}
						</Column>
					</Columns>
				</Card>
			</GridArea>

			<GridArea area="picker">
				<Card>
					<span>{course.crsid}</span>
					<span>{course.groupid}</span>
				</Card>
			</GridArea>
		</ModalContainer>
	)
}

const mapState = (state, ownProps) => {
	if (ownProps.studentId) {
		return {
			student: state.students[ownProps.studentId].data.present,
		}
	}
	return {}
}

const mapDispatch = dispatch =>
	bindActionCreators({addCourse, moveCourse, removeCourse}, dispatch)

// $FlowFixMe
export default connect(
	mapState,
	mapDispatch,
)(ModalCourse)
