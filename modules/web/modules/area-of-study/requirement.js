// @flow
import React, {Component} from 'react'

import isRequirementName from '../../../examine-student/is-requirement-name'

import Icon from '../../components/icon'
import {iosBoltOutline, iosBolt} from '../../icons/ionicons'
import Filter from './expression--filter'
import Expression from './expression'
import Button from '../../components/button'
import ResultIndicator from './result-indicator'

import './requirement.scss'

type RequirementInfo = {
    computed?: boolean,
    description?: string,
    filter?: Object,
    message?: string,
    name?: string,
    [key: string]: RequirementInfo,
}

type Props = {
    onAddOverride: (string[], Event) => any,
    onRemoveOverride: (string[], Event) => any,
    onToggleOverride: (string[], Event) => any,
    overridden?: boolean,
    path: string[],
    result?: Object,
    topLevel?: boolean,
    info: RequirementInfo,
}

type RequirementProps = Props & {
    isOpen?: boolean,
    onToggleOpen: () => any,
}

function Requirement(props: RequirementProps) {
    const {topLevel = false} = props
    const childKeys = Object.keys(props).filter(isRequirementName)

    const wasEvaluated = props.result && props.result._checked
    const computationClassName = wasEvaluated
        ? props.info.computed ? 'result-success' : 'result-failure'
        : ''
    const status = <ResultIndicator result={props.info.computed} />

    const extraClasses = [props.overridden ? 'overridden' : '']

    const result = props.result && (
        <div className="result">
            <Expression expr={props.result} ctx={props} />
        </div>
    )

    const message = props.info.message && (
        <p className="message">{props.info.message}</p>
    )
    const description = props.info.description && (
        <p className="description">{props.info.description}</p>
    )

    const filterEl = props.info.filter && (
        <div className="filter">
            Filter: <Filter expr={props.info.filter} ctx={props} />
        </div>
    )

    const title = !topLevel && (
        <h2
            className="heading"
            title={props.info.name}
            onClick={props.onToggleOpen}
        >
            <span className="title">
                {' '}
                {props.info.name}
                <span className="status">{status}</span>
            </span>
            <span className="manual-override">
                <span className="overridden-msg">
                    {props.overridden ? '(Overridden) ' : ''}
                </span>
                <Button
                    title={`${
                        props.overridden ? 'Remove' : 'Apply'
                    } a manual override to this requirement`}
                    onClick={ev => props.onToggleOverride(props.path, ev)}
                    type="flat"
                >
                    <Icon>{props.overridden ? iosBolt : iosBoltOutline}</Icon>
                </Button>
            </span>
        </h2>
    )

    const children = childKeys.map(key => (
        <ExpandableRequirement
            key={key}
            name={key}
            info={props.info[key]}
            path={props.path.concat(key)}
            onAddOverride={props.onAddOverride}
            onToggleOverride={props.onToggleOverride}
            onRemoveOverride={props.onRemoveOverride}
        />
    ))

    const overrideButtons = props.info.message &&
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

type State = {
    open: boolean,
}

export default class ExpandableRequirement extends Component<Props, State> {
    state = {
        open: true,
    }

    handleToggleOpen = () => {
        this.setState({open: !this.state.open})
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
