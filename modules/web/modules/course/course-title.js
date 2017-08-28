// @flow
import React from 'react'
import styled from 'styled-components'

const Base = `
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.2;
    padding: 0 0 1px;
    font-size: 1em;
    font-weight: 500;
`

const Title = styled.h1`${Base} font-feature-settings: 'onum';`

const Subtitle = styled.h2`${Base} font-size: 0.75em;`

const independentRegex = /^I[RS]/

type CourseTitleProps = {
    className?: string,
    name: string,
    title?: string,
    type?: string,
}

export default function CourseTitle({
    name,
    title,
    type,
    className,
}: CourseTitleProps) {
    const isIndependent = independentRegex.test(name)
    let courseName = title || name
    let subtitle = undefined

    if (isIndependent) {
        courseName = name
        if (courseName.length > 3) {
            courseName = courseName.substring(3)
        }
    } else if (type === 'Topic') {
        courseName = `${name.replace(/top.*: */gi, '')}`
        subtitle = title
    } else if (type === 'Seminar') {
        courseName = title
        subtitle = name
    }

    return (
        <div className={className}>
            <Title>{courseName}</Title>
            {subtitle && subtitle.length && <Subtitle>{subtitle}</Subtitle>}
        </div>
    )
}
