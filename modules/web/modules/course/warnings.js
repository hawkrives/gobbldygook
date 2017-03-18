// @flow

import React from 'react'
import styled from 'styled-components'
import { InlineList, InlineListItem } from '../../components/list'
import Icon from '../../components/icon'
import {
    iosClockOutline,
    iosCalendarOutline,
    alertCircled,
} from '../../icons/ionicons'

const WarningList = styled(InlineList)`
    font-size: 0.85em;
    font-feature-settings: "onum";
    padding-bottom: 2px;
`

const WarningItem = styled(InlineListItem)`
    display: flex;
    flex-flow: row wrap;
    align-items: center;

    padding: 0.125em 0.35em;
    border-radius: 0.25em;
    background-color: ${props => props.theme.amber200};
`

const WarningIcon = styled(Icon)`
    margin-right: 0.35em;
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
};

export class CourseWarnings extends React.PureComponent {
    props: {
        warnings: ?Array<WarningType>,
    };

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
                        <WarningIcon>{icons[w.type]}</WarningIcon> {w.msg}
                    </WarningItem>
                ))}
            </WarningList>
        )
    }
}
