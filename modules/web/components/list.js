// @flow
import React, {
    Children as ReactChildren,
    isValidElement,
    cloneElement,
} from 'react'
import cx from 'classnames'

import './list.scss'

type ListProps = {
    children?: any,
    className?: string,
    type?: 'inline' | 'number' | 'bullet' | 'plain',
};

export default function List(props: ListProps) {
    const { children, type = 'inline' } = props

    let { className } = props

    // eslint-disable-next-line no-confusing-arrow
    const contents = ReactChildren.map(
        children,
        child =>
            (isValidElement(child)
                ? cloneElement(child, {
                      ...child.props,
                      className: cx('list-item', child.props.className),
                  })
                : child)
    )

    className = cx('list', `list--${type}`, className)

    if (type === 'number') {
        return <ol className={className}>{contents}</ol>
    }

    return <ul className={className}>{contents}</ul>
}
