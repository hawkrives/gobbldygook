/* eslint-disable camelcase */

import * as variables from './variables'


export const material_shadow = `
	border: 1px solid;
	border-color: #e5e6e9 #dfe0e4 #d0d1d5;
`

export const card = `
	${material_shadow};
	background-color: white;
	border-radius: $base-border-radius;
`

export const card_content = `
	padding: 1em;
`

export const card_actions = `
	border-top: ${variables.material_divider};
	padding: 1em;
`

export const heading_neutral = `
	font-size: inherit;
	font-weight: inherit;
	margin-top: 0;
	margin-bottom: 0;
`

export const link_undecorated = `
	text-decoration: none;
	color: inherit;
`

export const list_inline = `
	display: inline-block;
	list-style: none;
	margin-top: 0;
	margin-bottom: 0;
	padding-left: 0;
`

export const list_unstyled = `
	margin: 0;
	padding: 0;
	list-style: none;
`

export const no_select = `
	user-select: none;
	cursor: default;
`
