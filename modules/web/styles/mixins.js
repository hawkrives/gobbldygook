// @flow

import {css} from 'styled-components'
import * as variables from './variables'

export const materialShadow = css`
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

export const card = css`
    ${materialShadow}
    background-color: white;
    border-radius: ${variables.baseBorderRadius};
`

export const cardContent = css`
    padding: 1em;
`

export const cardActions = css`
    border-top: ${variables.materialDivider};
    padding: 1em;
`

export const headingNeutral = css`
    font-size: inherit;
    font-weight: inherit;
    margin-top: 0;
    margin-bottom: 0;
`

export const linkUndecorated = css`
    text-decoration: none;
    color: inherit;
`

export const listInline = css`
    display: inline-block;
    list-style: none;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;

    & > li {
        display: inline-block;
    }
`

export const listUnstyled = css`
    margin: 0;
    padding: 0;
    list-style: none;
`

export const noSelect = css`
    user-select: none;
    cursor: default;
`
