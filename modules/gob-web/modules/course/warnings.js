// @flow

import React from 'react'
import styled from 'styled-components'
import {PlainList, ListItem} from '../../components/list'
import Icon from '../../components/icon'
import {
    iosClockOutline,
    iosCalendarOutline,
    alertCircled,
} from '../../icons/ionicons'
import * as theme from '../../theme'

const WarningList = styled(PlainList)`
    font-size: 0.85em;
    font-feature-settings: 'onum';
`

const WarningItem = styled(ListItem)`
    display: inline-flex;
    flex-flow: row nowrap;
    align-items: center;
    max-width: 100%;

    padding: 0.125em 0.35em;
    margin-bottom: 0.1em;
    border-radius: 0.25em;
    background-color: ${theme.amber200};
`

const WarningIcon = styled(Icon)`
    margin-right: 0.35em;
    flex-shrink: 0;
`

const WarningMessage = styled.span`
    flex: 1;
    ${theme.truncate};
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

type Props = {
    warnings: ?Array<WarningType>,
}

export default class CourseWarnings extends React.PureComponent<Props> {
    render() {
        if (!this.props.warnings) {
            return null
        }

        const warnings = this.props.warnings.filter(
            w => w && w.warning === true,
        )

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
