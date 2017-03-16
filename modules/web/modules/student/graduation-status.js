// @flow
import React from 'react'

import AreaOfStudySidebar from './area-of-study-sidebar'
import StudentSummary from './student-summary'

import './graduation-status.scss'

type AreaOfStudy = Object;
type Student = Object;
type PropTypes = {
    allAreas: AreaOfStudy[],
    onAddArea: (AreaOfStudy, Event) => any,
    onAddOverride: (string[], Event) => any,
    onChangeGraduation: (Event) => any,
    onChangeMatriculation: (Event) => any,
    onChangeName: (Event) => any,
    onEndAddArea: (string, Event) => any,
    onInitiateAddArea: (string, Event) => any,
    onRemoveArea: (Object, Event) => any,
    onRemoveOverride: (string[], Event) => any,
    onToggleOverride: (string[], Event) => any,
    showAreaPickerFor: {[key: string]: boolean},
    student: Student,
};

export default function GraduationStatus(props: PropTypes) {
    if (!props.student) {
        return null
    }

    return (
        <section className="graduation-status">
            <StudentSummary
                onChangeGraduation={props.onChangeGraduation}
                onChangeMatriculation={props.onChangeMatriculation}
                onChangeName={props.onChangeName}
                student={props.student}
            />
            <AreaOfStudySidebar
                allAreas={props.allAreas}
                showAreaPickerFor={props.showAreaPickerFor}
                onAddArea={props.onAddArea}
                onAddOverride={props.onAddOverride}
                onEndAddArea={props.onEndAddArea}
                onInitiateAddArea={props.onInitiateAddArea}
                onRemoveArea={props.onRemoveArea}
                onRemoveOverride={props.onRemoveOverride}
                onToggleOverride={props.onToggleOverride}
                student={props.student}
            />
        </section>
    )
}
