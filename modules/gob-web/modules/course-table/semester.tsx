import * as React from "react"
import cx from "classnames"
import { connect } from "react-redux"
import type { ConnectedProps } from "react-redux"
import { Link } from "@reach/router"
import { List, Map } from "immutable"
import { countCredits } from "@gob/examine-student"
import { semesterName } from "@gob/school-st-olaf-college"
import { DropTarget } from "react-dnd"
import type {
  ConnectDropTarget,
  DropTargetConnector,
  DropTargetMonitor,
} from "react-dnd"
import * as theme from "../../theme"
import { FlatButton } from "../../components/button"
import { Icon } from "../../components/icon"
import { InlineList, InlineListItem } from "../../components/list"
import { close, search, alertCircled } from "../../icons/ionicons"
import { IDENT_COURSE } from "@gob/object-student"
import type { Student, Schedule, WarningType } from "@gob/object-student"
import type { Course as CourseType, Result } from "@gob/types"
import { getCourse } from "../../helpers/get-courses"
import { changeStudent } from "../../redux/students/actions/change"
import type { DraggedCourse } from "../course/draggable"
import { CourseList } from "./course-list"
import styled from "styled-components"
import { loadDataForTerm } from "../../workers/load-data"

const Container = styled.div`
  ${theme.card};
  flex: 1 0;
  min-width: 13em;
  margin: var(--semester-spacing);
  overflow: hidden;
  color: var(--text-color);

  &.can-drop {
    cursor: copy;
    box-shadow: 0 0 4px var(--gray-500);
    z-index: 10;
  }

  --background-color: var(--white);
  --text-color: var(--black);
  --separator-color: var(--gray-100);
  --background-color-hover: var(--separator-color);

  &.past {
    --background-color: var(--teal-50);
    --separator-color: var(--teal-100);
  }

  &.in-progress {
    --background-color: var(--light-green-50);
    --separator-color: var(--light-green-100);
  }

  &.invalid {
    --background-color: var(--amber-50);
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
    background-color: var(--background-color-hover);
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

  overflow: hidden;

  padding-left: var(--semester-side-padding);

  & > ${Icon} {
    margin-right: var(--semester-side-padding);
  }
`

const InfoList = styled(InlineList)`
  font-size: 0.8em;
`

const InfoItem = styled(InlineListItem)`
  font-variant-numeric: oldstyle-nums;

  & + &::before {
    content: " – ";
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

function discoverSemesterStatus(
  args: Readonly<{
    year: number
    semester: number
    now: Date
  }>,
): "past" | "in-progress" | "future" | "unknown" {
  let { year, now } = args
  if (year < now.getFullYear()) {
    return "past"
  }
  if (year === now.getFullYear()) {
    return "in-progress"
  }
  if (year > now.getFullYear()) {
    return "future"
  }
  return "unknown"
}

type DnDProps = Readonly<{
  canDrop: boolean
  connectDropTarget: ConnectDropTarget
  isOver: boolean
}>

const connector = connect(undefined, { changeStudent })

type ReduxProps = Readonly<ConnectedProps<typeof connector>>

type ReactProps = Readonly<{
  schedule: Schedule
  semester: number
  student: Student
  year: number
}>

type Props = ReduxProps & DnDProps & ReactProps

type State = {
  loading: boolean
  checking: boolean
  courses: List<Result<CourseType>>
  warnings: Map<string, List<WarningType>>
  hasConflict: boolean
  credits: number
}

class Semester extends React.Component<Props, State> {
  override state: State = {
    loading: true,
    checking: true,
    courses: List(),
    warnings: Map(),
    hasConflict: false,
    credits: 0,
  }

  override componentDidMount() {
    void this.ensureDataExists()
    void this.prepare(this.props)
  }

  override componentDidUpdate(prevProps: Props) {
    if (this.props.schedule !== prevProps.schedule) {
      void this.prepare(this.props)
    }
  }

  ensureDataExists = async () => {
    await loadDataForTerm(this.props.schedule.getTerm())
  }

  prepare = async (props: Props) => {
    this.setState(() => ({ loading: true, checking: true }))

    let { schedule } = props
    let courses = await schedule.getCoursesWithErrors(
      getCourse,
      props.student.fabrications,
    )

    let onlyCourses = courses.flatMap((r) => (r.error ? [] : [r.result]))
    let credits = countCredits([...onlyCourses])

    this.setState(() => ({ courses, credits, loading: false }))

    let { warnings, hasConflict } = await schedule.validate(onlyCourses)

    this.setState(() => ({ warnings, hasConflict, checking: false }))
  }

  removeSemester = () => {
    const { student, semester, year } = this.props
    let s = student.destroySchedulesForTerm({ year, semester })
    this.props.changeStudent(s)
  }

  override render() {
    let props = this.props
    let { student, semester, year, canDrop } = props

    let schedule = this.props.schedule
    let { courses, credits, warnings, hasConflict, loading } = this.state

    let { recommendedCredits } = schedule
    let creditsPerCourse = 1
    let recommendedSlots = creditsPerCourse * recommendedCredits

    if (loading) {
      recommendedSlots = 0
    }

    const infoBar: Array<string> = []
    if (courses.size) {
      // prettier-ignore
      infoBar.push(`${courses.size} ${courses.size === 1 ? 'course' : 'courses'}`)

      // prettier-ignore
      infoBar.push(`${credits} ${credits === 1 ? 'credit' : 'credits'}`)
    }

    if (loading) {
      infoBar.unshift("Loading…")
    }

    let semesterStatus = discoverSemesterStatus({
      year,
      semester,
      now: new Date(),
    })

    const className = cx("semester", {
      invalid: hasConflict,
      "can-drop": canDrop,
      loading: loading,
      past: semesterStatus === "past",
      "in-progress": semesterStatus === "in-progress",
    })

    let name = semesterName(semester)

    return (
      <Container
        className={className}
        ref={(ref) => props.connectDropTarget(ref)}
      >
        <Header>
          {hasConflict && <Icon>{alertCircled}</Icon>}
          <Title to={`./term/${year}${semester}`} title={`Details for ${name}`}>
            <TitleText>{name}</TitleText>
            <InfoList>
              {infoBar.map((item) => (
                <InfoItem key={item}>{item}</InfoItem>
              ))}
            </InfoList>
          </Title>

          <TitleButton
            as={Link}
            to={`/student/${student.id}/search?term=${year}${semester}`}
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

        <CourseList
          courses={[...courses]}
          usedSlots={credits / creditsPerCourse}
          maxSlots={recommendedSlots / creditsPerCourse}
          warnings={warnings}
          scheduleId={schedule.id}
          studentId={student.id}
        />
      </Container>
    )
  }
}

// Implements the drag source contract.
const semesterTarget = {
  drop(props: ReactProps & ReduxProps, monitor: DropTargetMonitor) {
    let { clbid, fromScheduleId, isFromSchedule } =
      monitor.getItem() as DraggedCourse
    let { student, schedule } = props

    if (isFromSchedule && fromScheduleId != null) {
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
  canDrop(props: ReactProps, monitor: DropTargetMonitor) {
    let item = monitor.getItem() as DraggedCourse
    let hasClbid = props.schedule.clbids.includes(item.clbid)
    return !hasClbid
  },
}

// Specifies the props to inject into your component.
function collect(
  connect: DropTargetConnector,
  monitor: DropTargetMonitor,
): DnDProps {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
}

const droppable = DropTarget<ReactProps & ReduxProps, DnDProps>(
  IDENT_COURSE,
  semesterTarget,
  collect,
)(Semester)

const connected = connector(droppable)

export default connected
