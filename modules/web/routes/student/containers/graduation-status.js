import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import has from 'lodash/has'
import { pathToOverride } from 'modules/core/examine-student'

import { changeName, changeMatriculation, changeGraduation } from 'modules/web/redux/students/actions/change'
import { addArea, removeArea } from 'modules/web/redux/students/actions/areas'
import { setOverride, removeOverride } from 'modules/web/redux/students/actions/overrides'
import GraduationStatus from '../components/graduation-status'

class GraduationStatusContainer extends Component {
  static propTypes = {
    addArea: PropTypes.func.isRequired, // redux
    allAreas: PropTypes.array.isRequired, // redux
    changeGraduation: PropTypes.func.isRequired, // redux
    changeMatriculation: PropTypes.func.isRequired, // redux
    changeName: PropTypes.func.isRequired, // redux
    removeArea: PropTypes.func.isRequired, // redux
    removeOverride: PropTypes.func.isRequired, // redux
    setOverride: PropTypes.func.isRequired, // redux
    student: PropTypes.object.isRequired,
  };

  state = {
    showAreaPickerFor: {},
  };

  handleInitiateAddArea = (type, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    this.setState(state => ({
      showAreaPickerFor: { ...state.showAreaPickerFor, [type]: true },
    }))
  };

  handleEndAddArea = (type, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    this.setState(state => ({
      showAreaPickerFor: { ...state.showAreaPickerFor, [type]: false },
    }))
  };

  handleAddArea = (area, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    this.props.addArea(this.props.student.id, area)
  };

  handleAddOverride = (path, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    const codifiedPath = pathToOverride(path)
    this.props.setOverride(this.props.student.id, codifiedPath, true)
  };

  handleRemoveOverride = (path, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    const codifiedPath = pathToOverride(path)
    this.props.setOverride(this.props.student.id, codifiedPath)
  };

  handleToggleOverride = (path, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    const codifiedPath = pathToOverride(path)

    if (has(this.props.student.overrides, codifiedPath)) {
      this.props.removeOverride(this.props.student.id, codifiedPath)
    }
    else {
      this.props.setOverride(this.props.student.id, codifiedPath, true)
    }
  };

  handleRemoveArea = (areaQuery, ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    this.props.removeArea(this.props.student.id, areaQuery)
  };

  handleChangeGraduation = ev => {
    this.props.changeGraduation(this.props.student.id, parseInt(ev.target.value) || 0)
  };
  handleChangeMatriculation = ev => {
    this.props.changeMatriculation(this.props.student.id, parseInt(ev.target.value) || 0)
  };
  handleChangeName = ev => {
    this.props.changeName(this.props.student.id, ev.target.value)
  };

  render() {
    const student = this.props.student
    return (
			<GraduationStatus
  allAreas={this.props.allAreas}
  onAddArea={this.handleAddArea}
  onAddOverride={this.handleAddOverride}
  onChangeGraduation={this.handleChangeGraduation}
  onChangeMatriculation={this.handleChangeMatriculation}
  onChangeName={this.handleChangeName}
  onEndAddArea={this.handleEndAddArea}
  onInitiateAddArea={this.handleInitiateAddArea}
  onRemoveArea={this.handleRemoveArea}
  onRemoveOverride={this.handleRemoveOverride}
  onToggleOverride={this.handleToggleOverride}
  showAreaPickerFor={this.state.showAreaPickerFor}
  student={student}
			/>
    )
  }
}

const mapDispatch = dispatch =>
	bindActionCreators({ addArea, setOverride, removeOverride, removeArea, changeName, changeMatriculation, changeGraduation }, dispatch)

const mapState = state => ({ allAreas: state.areas.data })

export default connect(mapState, mapDispatch)(GraduationStatusContainer)
