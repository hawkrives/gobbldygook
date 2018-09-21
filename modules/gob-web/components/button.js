// @flow
import * as React from 'react'
import Link from 'react-router/lib/Link'
import styled from 'styled-components'
import * as theme from '../theme'

const BaseButton = styled('button')`
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
	border-radius: ${theme.baseBorderRadius};
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
	${theme.materialShadow};
	background-color: ${theme.white};

	&:hover {
		background-color: ${theme.white};
	}
	&:focus {
		background-color: ${theme.blue50};
		border-color: ${theme.blue300};
	}

	&:active {
		${theme.materialShadow};
		background-color: ${theme.white};
	}

	&[disabled] {
		cursor: default;
		color: ${theme.gray500};
	}
`

export const FlatButton = styled(BaseButton)`
	background-color: transparent;

	&:hover {
		background-color: ${theme.gray100};
		border-color: ${theme.gray400};
	}

	&:focus {
		background-color: ${theme.blue50};
		border-color: ${theme.blue300};
	}

	&[disabled] {
		cursor: default;
		color: ${theme.disabledForegroundLight};

		&:hover,
		&:focus,
		&:active {
			border-color: transparent;
			background-color: transparent;
		}
	}
`

export const FlatLinkButton = styled(FlatButton.withComponent(Link))`
    ${theme.linkUndecorated}
`

export const RaisedLinkButton = styled(RaisedButton.withComponent(Link))`
    ${theme.linkUndecorated}
`

type Props = {
	children?: any,
	className?: string,
	disabled?: boolean,
	link?: boolean,
	onClick?: Event => any,
	style?: Object,
	title?: string,
	to?: string | Object,
	type: 'flat' | 'raised',
}

export default class Button extends React.Component<Props> {
	static defaultProps = {
		type: 'flat',
	}

	render() {
		const {
			className,
			disabled,
			onClick,
			style,
			title,
			to,
			link,
			type,
		} = this.props

		const Tag = link
			? type === 'flat'
				? FlatLinkButton
				: RaisedLinkButton
			: type === 'flat'
				? FlatButton
				: RaisedButton

		return (
			<Tag
				type="button"
				className={className}
				disabled={disabled}
				onClick={onClick}
				style={style}
				title={title}
				to={to}
			>
				{this.props.children}
			</Tag>
		)
	}
}
