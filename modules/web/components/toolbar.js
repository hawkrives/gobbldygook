// @flow
import React from 'react'
import styled from 'styled-components'
import Button from './button'
import Icon from './icon'

const BaseToolbar = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: stretch;

    /* TODO: remove this chunk */
    & .button {
        flex: 1 0 auto;
        padding-left: 0.25em;
        padding-right: 0.25em;
    }

    & .icon {
        font-size: 1.5em;
    }
`

const Toolbar = (props: any) => (
    <BaseToolbar className={`toolbar ${props.className || ''}`}>
        {props.children}
    </BaseToolbar>
)

export default Toolbar

export const ToolbarButton = styled(Button)`
    flex: 1 0 auto;
    padding-left: 0.25em;
    padding-right: 0.25em;
`

export const ToolbarIcon = styled(Icon)`
    flex: 1 0 auto;
    padding-left: 0.25em;
    padding-right: 0.25em;
`
