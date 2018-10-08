// @flow

import styled from 'styled-components'

export const Sidebar = styled.aside`
	@media all and (min-width: 900px) {
		height: 100vh;
		overflow: scroll;
	}

	padding-left: var(--semester-spacing);
	padding-right: var(--semester-spacing);
	padding-top: var(--page-edge-padding);
	padding-bottom: var(--page-edge-padding);

	display: flex;
	flex-flow: column;
`
