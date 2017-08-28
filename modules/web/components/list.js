// @flow
import React, {
    Children as ReactChildren,
    isValidElement,
    cloneElement,
} from 'react'
import cx from 'classnames'
import styled from 'styled-components'

const BaseList = `
    margin: 0;
    padding: 0;
`

export const PlainList = styled.ul`${BaseList} list-style: none;`

export const InlineList = styled.ul`
    ${BaseList} display: inline-block;

    & > .list-item {
        display: inline-block;
    }
`

export const BulletedList = styled.ul`${BaseList};`

export const NumberedList = styled.ol`${BaseList};`

export const ListItem = styled.li``

export const InlineListItem = styled.li`display: inline-block;`

type ListProps = {
    children?: any,
    className?: string,
    type?: 'inline' | 'number' | 'bullet' | 'plain',
}

export default function List(props: ListProps) {
    const { className, children, type = 'inline' } = props
    const contents = ReactChildren.map(
        children,
        child =>
            isValidElement(child)
                ? cloneElement(child, {
                      ...child.props,
                      className: cx('list-item', child.props.className),
                  })
                : child
    )

    let ListType = PlainList
    if (type === 'inline') {
        ListType = InlineList
    } else if (type === 'number') {
        ListType = NumberedList
    } else if (type === 'bullet') {
        ListType = BulletedList
    }

    return <ListType className={className}>{contents}</ListType>
}
