import FakeCourse from "./fake-course.tsx"

type Props = {
  readonly className?: string
  readonly clbid: string
  readonly error: Error
}

export default function MissingCourse(props: Props) {
  return (
    <FakeCourse
      title={`Cannot load course ${props.clbid}`}
      details={props.error.message}
      className={`missing ${props.className ?? ""}`}
    />
  )
}
