// @flow

import React from 'react'
import styled from 'styled-components'
import { PlainList, ListItem } from '../../components/list'
import Icon from '../../components/icon'
import {
    iosClockOutline,
    iosCalendarOutline,
    alertCircled,
} from '../../icons/ionicons'

const WarningList = PlainList.extend`
    font-size: 0.85em;
    font-feature-settings: "onum";
`

const WarningItem = ListItem.extend`
    display: inline-flex;
    flex-flow: row nowrap;
    align-items: center;
    max-width: 100%;

    padding: 0.125em 0.35em;
    margin-bottom: 0.1em;
    border-radius: 0.25em;
    background-color: ${props => props.theme.amber200};
`

const WarningIcon = styled(Icon)`
    margin-right: 0.35em;
    flex-shrink: 0;
`

const WarningMessage = styled.span`
    flex: 1
    ${props => props.theme.truncate}
`

const icons = {
    'time-conflict': iosClockOutline,
    'invalid-semester': iosCalendarOutline,
    'invalid-year': alertCircled,
}

type WarningType = {
    type: string,
    msg: string,
    warning: boolean,
}

export default class CourseWarnings extends React.PureComponent {
    props: {
        warnings: ?Array<WarningType>,
    }

    render() {
        if (!this.props.warnings) {
            return null
        }

        const warnings = this.props.warnings
            .filter(Boolean)
            .filter(w => w.warning === true)

        if (!warnings.length) {
            return null
        }

        return (
            <WarningList>
                {warnings.map(w => (
                    <WarningItem key={w.msg}>
                        <WarningIcon>{icons[w.type]}</WarningIcon>
                        <WarningMessage>{w.msg}</WarningMessage>
                    </WarningItem>
                ))}
            </WarningList>
        )
    }
}
