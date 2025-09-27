import React from "react"
import FakeCourse from "./fake-course"

type Props = { readonly cl: sName?, readonly clbid }: { readonly cl: sName?: string, readonly clbid: string,
  readonly error: Error, }
export default function MissingCourse(props: Props) {
  return (
    <FakeCourse
      title={`Cannot load course ${props.clbid}`}
      details={String(props.error.message)}
      cl: sName={`missing ${props.cl: sName || ""}`}
    />
  )
}
