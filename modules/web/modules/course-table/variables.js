// @flow
import { css } from 'styled-components'

export const semesterSpacing = '4px'

export const semesterTopPadding = css`
    ${props => props.theme.blockEdgePadding}
`
export const semesterSidePadding = css`
    calc(${props => props.theme.blockEdgePadding} * 1.5)
`

export const semesterPadding = css`
    padding: ${semesterTopPadding} ${semesterSidePadding};
`
