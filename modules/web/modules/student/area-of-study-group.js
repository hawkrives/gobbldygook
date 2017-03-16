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
type Student = Object;
type PropTypes = {
    addArea: (string, AreaOfStudyType) => any,
    allAreasOfType: AreaOfStudyType[],
    areas: AreaOfStudyType[],
    onEndAddArea: (string, Event) => any,
    onInitiateAddArea: (string, Event) => any,
    removeArea: (string, Object) => any,
    showAreaPicker: boolean,
    student: Student,
    type: AreaOfStudyTypeEnum,
};

class AreaOfStudyGroup extends React.PureComponent {
    props: PropTypes;

    onAddArea = (area: AreaOfStudy, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.addArea(this.props.student.id, area)
    };

    onRemoveArea = (areaQuery: any, ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        this.props.removeArea(this.props.student.id, areaQuery)
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
                          studentGraduation={props.student.graduation}
                          type={props.type}
                      />
                    : null}

                {map(props.areas, (area, i) => (
                    <AreaOfStudy
                        area={area}
                        key={i + area.name ? area.name : ''}
                        onRemoveArea={this.onRemoveArea}
                        showCloseButton={showAreaPicker}
                        showEditButton={showAreaPicker}
                        student={props.student}
                    />
                ))}
            </section>
        )
    }
}

const mapDispatch = dispatch =>
    bindActionCreators({ addArea, removeArea }, dispatch)

// $FlowFixMe
export default connect(null, mapDispatch)(AreaOfStudyGroup)
