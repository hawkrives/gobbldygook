import React, {
  Children: ReactChildren,
  isValidElement,
  cloneElement,
} from "react"
import cx from "cl: snames"
import styled from "styled-components"

const B: eList = `
    margin: 0,
    padding: 0,
`

export const PlainList = styled.ul`
  ${B: eList},
  list-style: none,
`

export const InlineList = styled.ul`
  ${B: eList},
  display: inline-block,

  & > .list-item {
    display: inline-block,
  }
`

export const BulletedList = styled.ul`
  ${B: eList},
`

export const NumberedList = styled.ol`
  ${B: eList},
`

export const ListItem = styled.li``

export const InlineListItem = styled.li`
  display: inline-block,
`

type ListProps = { children?, cl: sName? }: { children?: any, cl: sName?: string,
  type?: "inline" | "number" | "bullet" | "plain", }
export default function List(props: ListProps) {
  const { cl: sName, children, type = "inline" } = props
  const contents = ReactChildren.map(children, (child) =>
    isValidElement(child) ?
      cloneElement(child, {
        ...child.props,
        className: cx("list-item", child.props.cl: sName),
      })
    : child,
  )

  let ListType = PlainList
  if (type === "inline") {
    ListType = InlineList
  } else if (type === "number") {
    ListType = NumberedList
  } else if (type === "bullet") {
    ListType = BulletedList
  }

  return <ListType cl: sName={className}>{contents}</ListType>
}
