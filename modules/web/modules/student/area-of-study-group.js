// @flow
import React from 'react'
import map from 'lodash/map'
import pluralizeArea from '../../../examine-student/pluralize-area'
import capitalize from 'lodash/capitalize'
import type { AreaOfStudyTypeEnum } from '../../../examine-student/types'

import AreaOfStudy from '../area-of-study'
import AreaPicker from './area-picker'
import Button from '../../components/button'

import './area-of-study-group.scss'

type AreaOfStudyType = Object;
type PropTypes = {
    allAreasOfType: AreaOfStudyType[],
    areas: AreaOfStudyType[],
    onAddArea: (AreaOfStudyType, Event) => any,
    onAddOverride: (string[], Event) => any,
    onEndAddArea: (string, Event) => any,
    onInitiateAddArea: (string, Event) => any,
    onRemoveArea: (Object, Event) => any,
    onRemoveOverride: (string[], Event) => any, // was optional
    onToggleOverride: (string[], Event) => any,
    showAreaPicker: boolean,
    studentGraduation: number,
    studentId: string,
    type: AreaOfStudyTypeEnum,
};

export default class AreaOfStudyGroup extends React.PureComponent {
    props: PropTypes;

    render() {
        const props = this.props
        const showAreaPicker = props.showAreaPicker || false
        const showOrHidePicker = showAreaPicker
            ? props.onEndAddArea
            : props.onInitiateAddArea

        return (
            <section className="area-of-study-group">
                <h1 className="area-type-heading">
                    {capitalize(pluralizeArea(props.type))}
                    <Button
                        className="add-area-of-study"
                        type="flat"
                        onClick={ev => showOrHidePicker(props.type, ev)}
                    >
                        {showAreaPicker ? 'Close' : 'Add ∙ Edit'}
                    </Button>
                </h1>

                {showAreaPicker
                    ? <AreaPicker
                          areaList={props.allAreasOfType}
                          currentAreas={props.areas}
                          onAddArea={props.onAddArea}
                          studentGraduation={props.studentGraduation}
                          type={props.type}
                      />
                    : null}

                {map(props.areas, (area, i) => (
                    <AreaOfStudy
                        area={area}
                        key={i + area.name ? area.name : ''}
                        onAddOverride={props.onAddOverride}
                        onRemoveArea={props.onRemoveArea}
                        onRemoveOverride={props.onRemoveOverride}
                        onToggleOverride={props.onToggleOverride}
                        showCloseButton={showAreaPicker}
                        showEditButton={showAreaPicker}
                        studentId={props.studentId}
                    />
                ))}
            </section>
        )
    }
}
