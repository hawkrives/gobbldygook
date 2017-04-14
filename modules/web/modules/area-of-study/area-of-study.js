// @flow
import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Button from '../../components/button'
import Icon from '../../components/icon'
import Requirement from './requirement'
import ProgressBar from '../../components/progress-bar'
import { compareProps } from '../../../lib'
import { close, chevronUp, chevronDown } from '../../icons/ionicons'
import has from 'lodash/has'
import pathToOverride from '../../../examine-student/path-to-override'
import {
    setOverride,
    removeOverride,
} from '../../redux/students/actions/overrides'

import './area-of-study.scss'

type Student = Object
type AreaOfStudyType = {
    _area?: Object,
    _checked?: boolean,
    _error?: string,
    _progress?: { at: number, of: number },
    isCustom?: boolean,
    name: string,
    revision: string,
    slug?: string,
    type: string,
}

class AreaOfStudyContainer extends Component {
    props: {
        area: AreaOfStudyType,
        setOverride: (string, string, boolean) => any,
        onRemoveArea: (Object, Event) => any,
        removeOverride: (string, string) => any,
        showCloseButton: boolean,
        showEditButton: boolean,
        student: Student,
    }

    state = {
        isOpen: false,
        confirmRemoval: false,
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return (
            compareProps(this.props, nextProps) ||
            compareProps(this.state, nextState)
        )
    }

    startRemovalConfirmation = (ev: Event) => {
        ev.preventDefault()
        this.setState({ confirmRemoval: true })
    }

    endRemovalConfirmation = (ev: Event) => {
        ev.preventDefault()
        this.setState({ confirmRemoval: false })
    }

    toggleAreaExpansion = (ev: Event) => {
        ev.preventDefault()
        this.setState({ isOpen: !this.state.isOpen })
    }

    addOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)
        this.props.setOverride(this.props.student.id, codifiedPath, true)
    }

    removeOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)
        this.props.removeOverride(this.props.student.id, codifiedPath)
    }

    toggleOverride = (path: string[], ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
        const codifiedPath = pathToOverride(path)

        if (has(this.props.student.overrides, codifiedPath)) {
            this.props.removeOverride(this.props.student.id, codifiedPath)
        } else {
            this.props.setOverride(this.props.student.id, codifiedPath, true)
        }
    }

    render() {
        const props = this.props
        const { isOpen, confirmRemoval: showConfirmRemoval } = this.state

        const {
            type = '???',
            revision = '0000-00',
            slug,
            isCustom = false,
            name = 'Unknown Area',
            _area: areaDetails,
            _progress: progress,
            _error: error = '',
            _checked: checked = false,
        } = props.area

        const progressAt = typeof progress === 'object' ? progress.at : 0
        const progressOf = typeof progress === 'object' ? progress.of : 1

        const summary = (
            <div>
                <div className="area--summary-row">
                    <h1 className="area--title">
                        {slug && !isCustom && isOpen
                            ? <a
                                  className="catalog-link"
                                  href={`http://catalog.stolaf.edu/academic-programs/${slug}/`}
                                  target="_blank"
                                  onClick={ev => ev.stopPropagation()}
                                  title="View in the St. Olaf Catalog"
                              >
                                  {name}
                              </a>
                            : name}
                    </h1>
                    <span className="icons">
                        {props.showCloseButton &&
                            <Button
                                className="area--remove-button"
                                onClick={this.startRemovalConfirmation}
                            >
                                <Icon>{close}</Icon>
                            </Button>}
                        <Icon className="area--open-indicator">
                            {isOpen ? chevronUp : chevronDown}
                        </Icon>
                    </span>
                </div>
                <ProgressBar
                    className={cx('area--progress', { error: Boolean(error) })}
                    colorful={true}
                    value={progressAt}
                    max={progressOf}
                />
            </div>
        )

        const removalConfirmation = (
            <div className="area--confirm-removal">
                <p>Remove <strong>{name}</strong>?</p>
                <span className="button-group">
                    <Button
                        className="area--actually-remove-area"
                        onClick={ev =>
                            props.onRemoveArea({ name, type, revision }, ev)}
                    >
                        Remove
                    </Button>
                    <Button onClick={this.endRemovalConfirmation}>
                        Cancel
                    </Button>
                </span>
            </div>
        )

        let contents = null
        if (error) {
            contents = <p className="message area--error">{error} {':('}</p>
        } else if (!checked) {
            contents = <p className="message area--loading">Loading…</p>
        } else {
            contents = (
                <Requirement
                    {...areaDetails}
                    topLevel
                    onAddOverride={this.addOverride}
                    onRemoveOverride={this.removeOverride}
                    onToggleOverride={this.toggleOverride}
                    path={[type, name]}
                />
            )
        }

        const className = cx('area', {
            errored: Boolean(error),
            loading: !checked,
        })

        return (
            <div className={className}>
                <div
                    className="area--summary"
                    onClick={this.toggleAreaExpansion}
                >
                    {showConfirmRemoval ? removalConfirmation : summary}
                </div>
                {isOpen && !showConfirmRemoval && contents}
            </div>
        )
    }
}

const mapDispatch = dispatch =>
    bindActionCreators({ setOverride, removeOverride }, dispatch)

// $FlowFixMe
export default connect(null, mapDispatch)(AreaOfStudyContainer)
