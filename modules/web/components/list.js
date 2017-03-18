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
    list-style: none;
`

const InlineList = styled.ul`
    ${BaseList}
    display: inline-block;

    & > .list-item {
        display: inline-block;
    }
`

const BulletedList = styled.ul`
    ${BaseList}
`

const NumberedList = styled.ol`
    ${BaseList}
`

type ListProps = {
    children?: any,
    className?: string,
    type?: 'inline' | 'number' | 'bullet' | 'plain',
};

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

    let ListType = BulletedList
    if (type === 'inline') {
        ListType = InlineList
    } else if (type === 'number') {
        ListType = NumberedList
    }

    return <ListType className={className}>{contents}</ListType>
}
