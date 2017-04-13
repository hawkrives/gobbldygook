// @flow
import React from 'react'
import './course-title.scss'

const independentRegex = /^I[RS]/

type CourseTitleProps = {
    className?: string,
    name: string,
    title?: string,
    type?: string,
};

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
            <h1 className="course-title">{courseName}</h1>
            {subtitle &&
                subtitle.length &&
                <h2 className="course-subtitle">{subtitle}</h2>}
        </div>
    )
}
