// @flow
import React, { Component } from 'react'
import filter from 'lodash/filter'
import keys from 'lodash/keys'
import map from 'lodash/map'

import isRequirementName from '../../../examine-student/is-requirement-name'

import Icon from '../../components/icon'
import { iosBoltOutline, iosBolt } from '../../icons/ionicons'
import Filter from './expression--filter'
import Expression from './expression'
import Button from '../../components/button'
import ResultIndicator from './result-indicator'

import './requirement.scss'

type PropTypes = {
    computed?: boolean,
    description?: string,
    filter?: Object,
    isOpen?: boolean,
    message?: string,
    name?: string,
    onAddOverride: (string[], Event) => any,
    onRemoveOverride: (string[], Event) => any,
    onToggleOpen: () => any,
    onToggleOverride: (string[], Event) => any,
    overridden?: boolean,
    path: string[],
    result?: Object,
    topLevel?: boolean,
}

function Requirement(props: PropTypes) {
    const { topLevel = false } = props
    const childKeys = filter(keys(props), isRequirementName)

    const wasEvaluated = props.result && props.result._checked
    const computationClassName = wasEvaluated
        ? props.computed ? 'result-success' : 'result-failure'
        : ''
    const status = <ResultIndicator result={props.computed} />

    const extraClasses = [props.overridden ? 'overridden' : '']

    const result = props.result && (
        <div className="result">
            <Expression expr={props.result} ctx={props} />
        </div>
    )

    const message = props.message && <p className="message">{props.message}</p>
    const description = props.description && (
        <p className="description">{props.description}</p>
    )

    const filterEl = props.filter && (
        <div className="filter">
            Filter: <Filter expr={props.filter} ctx={props} />
        </div>
    )

    const title = !topLevel && (
        <h2 className="heading" title={props.name} onClick={props.onToggleOpen}>
            <span className="title">
                {' '}
                {props.name}
                <span className="status">{status}</span>
            </span>
            <span className="manual-override">
                <span className="overridden-msg">
                    {props.overridden ? '(Overridden) ' : ''}
                </span>
                <Button
                    title={`${props.overridden
                        ? 'Remove'
                        : 'Apply'} a manual override to this requirement`}
                    onClick={ev => props.onToggleOverride(props.path, ev)}
                    type="flat"
                >
                    <Icon>{props.overridden ? iosBolt : iosBoltOutline}</Icon>
                </Button>
            </span>
        </h2>
    )

    const children = map(childKeys, key => (
        <ExpandableRequirement
            key={key}
            name={key}
            {...props[key]}
            path={props.path.concat(key)}
            onAddOverride={props.onAddOverride}
            onToggleOverride={props.onToggleOverride}
            onRemoveOverride={props.onRemoveOverride}
        />
    ))

    const overrideButtons = props.message &&
    !props.result && (
        <span className="required-override-buttons button-group">
            <Button
                onClick={ev => props.onRemoveOverride(props.path, ev)}
                type="flat"
            >
                Not yet…
            </Button>
            <Button
                onClick={ev => props.onAddOverride(props.path, ev)}
                type="flat"
            >
                Done!
            </Button>
        </span>
    )

    let className = [
        'requirement',
        extraClasses.join(' '),
        computationClassName,
        props.isOpen ? 'is-open' : 'is-closed',
    ].join(' ')

    return (
        <div className={className}>
            {title}
            {description}
            {message}
            {overrideButtons}
            {filterEl}
            {result}
            {children.length ? (
                <div className="children">{children}</div>
            ) : null}
        </div>
    )
}

export default class ExpandableRequirement extends Component {
    state = {
        open: true,
    }

    handleToggleOpen = () => {
        this.setState({ open: !this.state.open })
    }

    render() {
        return (
            <Requirement
                {...this.props}
                isOpen={this.state.open}
                onToggleOpen={this.handleToggleOpen}
            />
        )
    }
}
