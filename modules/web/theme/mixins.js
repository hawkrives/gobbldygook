// @flow

import { css } from 'styled-components'

export const contentBlockSpacing = css`
    padding-top: ${props => props.theme.pageEdgePadding};
    padding-bottom: 15vh;
    overflow-y: scroll;
`

export const materialShadow = `
    border: 1px solid;
    border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

export const elevation1 = `
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2);
`

export const elevation2 = `
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
`

export const elevation3 = `
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.3);
`

export const elevation4 = `
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);
`

export const elevation5 = `
    box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.3);
`

export const baseCard = css`
    background-color: white;
    border-radius: ${props => props.theme.baseBorderRadius};
`

export const card = css`
    ${elevation1}
    ${baseCard}
`

export const cardContent = `
    padding: 1em;
`

export const cardActions = css`
    border-top: ${props => props.theme.materialDivider};
    padding: 1em;
`

export const headingNeutral = `
    font-size: inherit;
    font-weight: inherit;
    margin-top: 0;
    margin-bottom: 0;
`

export const linkUndecorated = `
    text-decoration: none;
    color: inherit;
`

export const listInline = `
    display: inline-block;
    list-style: none;
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 0;

    & > li {
        display: inline-block;
    }
`

export const listUnstyled = `
    margin: 0;
    padding: 0;
    list-style: none;
`

export const noSelect = `
    user-select: none;
    cursor: default;
`

export const truncate = `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

export const truncateWidth = (width: string) =>
    `
    ${truncate}
    width: ${width};
`
