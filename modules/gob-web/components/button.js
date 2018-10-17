// @flow

import styled from 'styled-components'
import * as theme from '../theme'

const BaseButton = styled.button.attrs({type: 'button'})`
	cursor: pointer;

	min-height: 3ex;
	display: inline-flex;
	justify-content: center;
	align-items: center;

	// display: inline-flex collapses inline whitespace
	// white-space: pre brings it back, although it will
	// also show newlines, so be careful.
	white-space: pre;

	padding: 0.5em 0.5em;
	border: solid 1px transparent;

	transition: all 0.2s ease-out;
	border-radius: var(--base-border-radius);
	line-height: normal;

	text-align: center;
	text-transform: uppercase;

	outline: 0;
	color: currentColor;

	// Turn off default button styles in webkit
	-webkit-appearance: initial !important; // override normalize's html [type=button]

	// Gets rid of tap active state
	-webkit-tap-highlight-color: transparent;
`

export const RaisedButton = styled(BaseButton)`
	${theme.linkUndecorated};
	${theme.materialShadow};

	background-color: var(--white);

	&:hover {
		background-color: var(--white);
		box-shadow: 0 2px 4px 0 rgba(14, 30, 37, 0.12);
		border-radius: var(--base-border-radius);
	}
	&:focus {
		background-color: var(--blue-50);
		border-color: var(--blue-300);
	}

	&:active {
		${theme.materialShadow};
		background-color: var(--white);
	}

	&[disabled] {
		cursor: default;
		background-color: var(--disabled-background);
		color: var(--disabled-foreground);
	}
`

export const FlatButton = styled(BaseButton)`
	${theme.linkUndecorated};

	background-color: transparent;

	&:hover {
		background-color: var(--gray-100);
		border-color: var(--gray-400);
	}

	&:focus {
		background-color: var(--blue-50);
		border-color: var(--blue-300);
	}

	&[disabled] {
		cursor: default;
		color: var(--disabled-foreground);

		&:hover,
		&:focus,
		&:active {
			border-color: transparent;
			background-color: transparent;
		}
	}
`
