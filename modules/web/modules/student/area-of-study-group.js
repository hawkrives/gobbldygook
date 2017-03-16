// @flow
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import map from 'lodash/map'
import pluralizeArea from '../../../examine-student/pluralize-area'
import capitalize from 'lodash/capitalize'
import type { AreaOfStudyTypeEnum } from '../../../examine-student/types'
import { addArea, removeArea } from '../../redux/students/actions/areas'
import AreaOfStudy from '../area-of-study'
import AreaPicker from './area-picker'
import Button from '../../components/button'

import './area-of-study-group.scss'

type AreaOfStudyType = Object;
type PropTypes = {
    addArea: (string, AreaOfStudyType) => any,
    allAreasOfType: AreaOfStudyType[],
    areas: AreaOfStudyType[],
    onAddOverride: (string[], Event) => any,
    onEndAddArea: (string, Event) => any,
    onInitiateAddArea: (string, Event) => any,
    onRemoveOverride: (string[], Event) => any, // was optional
    onToggleOverride: (string[], Event) => any,
    removeArea: (string, Object) => any,
    showAreaPicker: boolean,
    studentGraduation: number,
    studentId: string,
    type: AreaOfStudyTypeEnum,
};

class AreaOfStudyGroup extends React.PureComponent {
    props: PropTypes;

    onAddArea = (area: AreaOfStudy, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.addArea(this.props.studentId, area)
    };

    onRemoveArea = (areaQuery: any, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.removeArea(this.props.studentId, areaQuery)
    };

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
                          onAddArea={this.onAddArea}
                          studentGraduation={props.studentGraduation}
                          type={props.type}
                      />
                    : null}

                {map(props.areas, (area, i) => (
                    <AreaOfStudy
                        area={area}
                        key={i + area.name ? area.name : ''}
                        onAddOverride={props.onAddOverride}
                        onRemoveArea={this.onRemoveArea}
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

const mapDispatch = dispatch =>
    bindActionCreators(
        {
            addArea,
            removeArea,
        },
        dispatch
    )

// $FlowFixMe
export default connect(null, mapDispatch)(AreaOfStudyGroup)
