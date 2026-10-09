import * as React from "react"
import range from "lodash/range"
import cx from "classnames"
import listify from "listify"
import sample from "lodash/sample"
import { List } from "immutable"
import { connect, type ConnectedProps } from "react-redux"
import { Card } from "../../components/card"
import { AvatarLetter } from "../../components/avatar-letter"
import { changeStudent } from "../../redux/students/actions/change"
import { Student, type AreaQuery } from "@gob/object-student"
import { checkStudentAgainstArea } from "../../workers/check-student"
import { loadArea } from "../../helpers/load-area"
import uniqueId from "lodash/uniqueId"
import { getCourse } from "../../helpers/get-courses"
import { countCredits } from "@gob/examine-student"
import { expandYear } from "@gob/school-st-olaf-college"

import "./student-summary.scss"

const welcomeMessages = [
  "Hi, ",
  "Hi there, ",
  "Hello, ",
  "こんにちは、", // japanese
  "ようこそ、", // japanese
  "Fram! Fram! ", // new norwegian
  "Salut, ", // french
  "Aloha, ", // hawaiian
  "Привет, ", // russian
  "Вітаю, ", // ukrainian
  "Sawubona, ", // zulu
  "Hei, ", // norwegian
  "Hej, ", // polish, swedish
  "Hola, ", // spanish
  "Bonjour, ", // french
  "Hallo, ", // german
  "nyob zoo ", // hmong
  "你好，", // mandarin
  "안녕하세요 ", // korean
  "สวัสดี ", // thai
  "halo, ", // indonesian
  "Salve, ", // latin
  "Χαῖρε! ", // ancient greek
  "Zdravo, ", // bosnian
  "Bok, ", // croatian
  "ahoj, ", // czech, slovak
  "Tere, ", // estonian
  "Bula, ", // fijian
  "Zdravo, ", // serbian
  "Hujambo, ", // swahili
  "Xin chào, ", // vietnamese
  "Sholem, ", // yiddish
]

const welcomeMessage = welcomeMessages[2]

type Props = Readonly<{
  randomizeHello?: boolean
  showAvatar?: boolean
  showMessage?: boolean
  showEditor?: boolean
  student: Student
}>

type State = {
  message: string
  canGraduate: boolean
  creditsNeeded: number | null
  creditsTaken: number | null
  checking: boolean
}

class StudentSummary extends React.Component<Props, State> {
  override state: State = {
    message:
      (this.props.randomizeHello === true
        ? sample(welcomeMessages)
        : welcomeMessage) ?? "",
    checking: true,
    canGraduate: false,
    creditsNeeded: null,
    creditsTaken: null,
  }

  override componentDidMount() {
    void this.check(this.props)
  }

  override componentDidUpdate(prevProps: Props) {
    if (prevProps.student !== this.props.student) {
      void this.check(this.props)
    }
  }

  check = async (props: Props) => {
    this.setState(() => ({ checking: true }))
    await Promise.all([
      this.countCredits(props),
      this.checkGraduatability(props),
    ])
    this.setState(() => ({ checking: false }))
  }

  countCredits = async (props: Props) => {
    let { student } = props
    let courses = await student.activeCourses(getCourse)
    let credits = countCredits(courses)
    this.setState(() => ({ creditsTaken: credits }))
  }

  checkGraduatability = async (props: Props) => {
    let { student } = props

    let areas = student.studies.toArray().map((area) => loadArea(area))
    let loadedAreas = (await Promise.all(areas)).flatMap((area) =>
      area.error ? [] : [area.data],
    )

    let promises = loadedAreas.map((a) => checkStudentAgainstArea(student, a))
    let results = await Promise.all(promises)

    let canGraduate = results.every((r) => r.computed === true)
    // let {creditsNeeded = 0, creditsTaken = 0} = {}

    this.setState(() => ({
      canGraduate,
      // creditsNeeded,
      // creditsTaken,
    }))
  }

  override render() {
    let {
      student,
      showMessage = true,
      showEditor = true,
      showAvatar = true,
    } = this.props
    let { checking, canGraduate, creditsTaken } = this.state
    let { studies } = student
    let gradClassName = canGraduate ? "can-graduate" : "cannot-graduate"
    let message = this.state.message
    let { creditsNeeded } = student

    canGraduate = canGraduate && Number(creditsTaken) >= creditsNeeded

    let url = new URLSearchParams(window.location.search)

    return (
      <Card
        as="article"
        className={cx("student-summary", gradClassName, { checking })}
      >
        {url.has("ferpa") ? (
          <div
            style={{
              backgroundColor: "var(--red)",
              textShadow: "none",
              color: "white",
              marginBottom: "1em",
            }}
          >
            FERPA restrictions enabled
          </div>
        ) : null}

        {showEditor && <ConnectedEditor student={student} />}

        {showAvatar && (
          <AvatarLetter
            className={cx(
              "student-letter",
              canGraduate ? "can-graduate" : "cannot-graduate",
            )}
            value={student.name}
          />
        )}

        <Header
          key={student.name}
          canGraduate={canGraduate}
          name={student.name}
          helloMessage={message}
          showAvatar={showAvatar}
        />

        <DateSummary
          matriculation={student.matriculation}
          graduation={student.graduation}
        />

        <DegreeSummary studies={studies} />

        <CreditSummary
          currentCredits={creditsTaken}
          neededCredits={creditsNeeded}
        />

        {showMessage ? <Footer canGraduate={canGraduate} /> : null}
      </Card>
    )
  }
}

export { StudentSummary }

const editorConnector = connect(undefined, { changeStudent })

type EditorProps = {
  student: Student
} & ConnectedProps<typeof editorConnector>

type EditorState = {
  name: string
  matriculation: string
  graduation: string
}

class Editor extends React.Component<EditorProps, EditorState> {
  override state: EditorState = {
    name: this.props.student.name,
    matriculation: String(this.props.student.matriculation),
    graduation: String(this.props.student.graduation),
  }

  nameLabelId = `student-editor--${uniqueId()}`
  matriculationLabelId = `student-editor--${uniqueId()}`
  graduationLabelId = `student-editor--${uniqueId()}`

  changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.currentTarget.value
    this.setState(() => ({ name: val }))
  }

  changeGraduation = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.currentTarget.value
    this.setState(() => ({ graduation: val }))
  }

  changeMatriculation = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.currentTarget.value
    this.setState(() => ({ matriculation: val }))
  }

  onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()

    let { name, matriculation, graduation } = this.state
    let s = this.props.student

    if (matriculation !== String(s.matriculation)) {
      s = s.setMatriculation(matriculation)
    }

    if (graduation !== String(s.graduation)) {
      s = s.setGraduation(graduation)
    }

    if (name !== s.name) {
      s = s.setName(name)
    }

    if (s !== this.props.student) {
      this.props.changeStudent(s)
    }
  }

  override render() {
    return (
      <form onSubmit={this.onSubmit} className="student-summary--editor">
        <label htmlFor={this.nameLabelId}>Name:</label>
        <input
          id={this.nameLabelId}
          onChange={this.changeName}
          onBlur={this.onSubmit}
          value={this.state.name}
        />

        <label htmlFor={this.matriculationLabelId}>Matriculation:</label>
        <input
          id={this.matriculationLabelId}
          onChange={this.changeMatriculation}
          onBlur={this.onSubmit}
          value={this.state.matriculation}
        />

        <label htmlFor={this.graduationLabelId}>Graduation:</label>
        <input
          id={this.graduationLabelId}
          onChange={this.changeGraduation}
          onBlur={this.onSubmit}
          value={this.state.graduation}
        />

        <label htmlFor={this.nameLabelId}>Catalog Year:</label>
        <select value={this.state.matriculation}>
          {range(
            parseInt(this.state.matriculation),
            parseInt(this.state.graduation),
          ).map((y) => {
            return (
              <option key={y} value={y}>
                {expandYear(y)}
              </option>
            )
          })}
        </select>
      </form>
    )
  }
}

const ConnectedEditor = editorConnector(Editor)

type HeaderProps = {
  canGraduate: boolean
  helloMessage: string
  name: string
  onChangeName?: (name: string) => unknown
  showAvatar: boolean
}

export class Header extends React.Component<HeaderProps> {
  handleNameChange = (val: string) => {
    console.log(val)
    this.props.onChangeName?.(val)
  }

  override render() {
    const props = this.props

    return (
      <header className="student-summary--header">
        {props.helloMessage}
        {this.props.name}!
      </header>
    )
  }
}

type FooterProps = {
  canGraduate: boolean
}

const goodGraduationMessage =
  "It looks like you'll make it! Just follow the plan, and go over my output with your advisor a few times."
const badGraduationMessage =
  "You haven't planned everything out yet. Ask your advisor if you need help fitting everything in."

export class Footer extends React.Component<FooterProps> {
  override render() {
    const msg = this.props.canGraduate
      ? goodGraduationMessage
      : badGraduationMessage

    return <p className="paragraph graduation-message">{msg}</p>
  }
}

type DateSummaryProps = {
  matriculation: number
  graduation: number
}

export class DateSummary extends React.Component<DateSummaryProps> {
  override render() {
    const props = this.props

    return (
      <p className="paragraph">
        After matriculating in {String(props.matriculation)}, you are planning
        to graduate in {String(props.graduation)}.
      </p>
    )
  }
}

type DegreeSummaryProps = {
  studies: List<AreaQuery>
}

export class DegreeSummary extends React.Component<DegreeSummaryProps> {
  override render() {
    const grouped = this.props.studies.groupBy((s) => s.type)

    const dS = grouped.get("degree", List<AreaQuery>())
    const mS = grouped.get("major", List<AreaQuery>())
    const cS = grouped.get("concentration", List<AreaQuery>())
    const eS = grouped.get("emphasis", List<AreaQuery>())

    const dCount = dS.size
    const mCount = mS.size
    const cCount = cS.size
    const eCount = eS.size

    const dWord = dCount === 1 ? "degree" : "degrees"
    const mWord = mCount === 1 ? "major" : "majors"
    const cWord = cCount === 1 ? "concentration" : "concentrations"
    const eWord = eCount === 1 ? "emphasis" : "emphases"

    const dEmph = dCount === 1 ? "a " : ""
    const mEmph = mCount === 1 ? "a " : ""
    const cEmph = cCount === 1 ? "a " : ""
    const eEmph = eCount === 1 ? "an " : ""

    const dList = listify([...dS.map((d) => d.name)])
    const mList = listify([...mS.map((m) => m.name)])
    const cList = listify([...cS.map((c) => c.name)])
    const eList = listify([...eS.map((e) => e.name)])

    return (
      <p className="paragraph">
        You are planning on{" "}
        {dCount > 0 ? `${dEmph}${dList} ${dWord}` : `no ${dWord}`}
        {mCount || cCount || eCount
          ? mCount && (cCount || eCount)
            ? ", "
            : " and "
          : ""}
        {mCount ? `${mEmph}${mWord} in ${mList}` : ""}
        {mCount && cCount ? ", and " : ""}
        {cCount ? `${cEmph}${cWord} in ${cList}` : ""}
        {(mCount || cCount) && eCount ? ", " : ""}
        {eCount ? `not to mention ${eEmph}${eWord} in ${eList}` : ""}
        {"."}
      </p>
    )
  }
}

type CreditSummaryProps = {
  currentCredits: number | null | undefined
  neededCredits: number | null | undefined
}

export class CreditSummary extends React.Component<CreditSummaryProps> {
  override render() {
    let { currentCredits, neededCredits } = this.props

    if (currentCredits == null) {
      return null
    }

    if (neededCredits == null) {
      return (
        <p className="paragraph">
          You have currently planned for {currentCredits} credits.
        </p>
      )
    }

    let enoughCredits = currentCredits >= neededCredits
    let anyCredits = neededCredits > 0

    return (
      <p className="paragraph">
        You have currently planned for {currentCredits} of your {neededCredits}{" "}
        required credits.
        {anyCredits && enoughCredits ? " Good job!" : ""}
      </p>
    )
  }
}
