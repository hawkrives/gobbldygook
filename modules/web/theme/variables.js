// @flow
import { css } from 'styled-components'

// colors
export const background = '#e9eaed'
export const textColor = '#2c281f'

// fonts
export const sansFontStack = 'Fira Sans, Helvetica, Verdana, sans-serif'
export const bodyFontStack = sansFontStack
export const headingFontStack = sansFontStack

// spacing
export const pageEdgePadding = '15px'
export const blockEdgePadding = '5px'
export const areaEdgePadding = '0.5em'

// z-indices
export const zSidebar = '3'
export const zFloatingButton = '2'

// media queries
export const singleColumnWidth = '35em'
export const yearCollapseWidth = '47.5em'

export const materialDivider = '1px solid rgba(160, 160, 160, 0.2)'
export const baseBorderRadius = '3px'
export const sidebarWidth = '270px'

// semesters
export const semesterSpacing = '4px'

export const semesterTopPadding = css`${props => props.theme.blockEdgePadding};`
export const semesterSidePadding = css`
    calc(${props => props.theme.blockEdgePadding} * 1.5)
`

export const semesterPadding = css`
    padding: ${semesterTopPadding} ${semesterSidePadding};
`
