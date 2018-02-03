// @flow
import * as React from 'react'
import Link from 'react-router/lib/Link'
import styled from 'styled-components'

const BaseButton = styled.button`
    cursor: pointer;

    min-height: 3ex;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    // display: inline-flex collapses inline whitespace
    // white-space: pre brings it back, although it will
    // also show newlines, so be careful.
    white-space: pre;

    padding: 1ex 2em;
    border: solid 1px transparent;

    transition: all 0.2s ease-out;
    border-radius: ${props => props.theme.baseBorderRadius};
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

const RaisedButton = BaseButton.extend`
    ${props => props.theme.materialShadow};
    background-color: ${props => props.theme.white};

    &:hover {
        background-color: ${props => props.theme.white};
    }
    &:focus {
        background-color: ${props => props.theme.blue50};
        border-color: ${props => props.theme.blue300};
    }

    &:active {
        ${props => props.theme.materialShadow};
        background-color: ${props => props.theme.white};
    }

    &[disabled] {
        cursor: default;
        color: ${props => props.theme.gray500};
    }
`

const FlatButton = BaseButton.extend`
    background-color: transparent;

    &:hover {
        background-color: ${props => props.theme.gray100};
        border-color: ${props => props.theme.gray400};
    }

    &:focus {
        background-color: ${props => props.theme.blue50};
        border-color: ${props => props.theme.blue300};
    }

    &[disabled] {
        cursor: default;
        color: ${props => props.theme.disabledForegroundLight};

        &:hover,
        &:focus,
        &:active {
            border-color: transparent;
            background-color: transparent;
        }
    }
`

const FlatLinkButton = FlatButton.withComponent(Link).extend`
    ${props => props.theme.linkUndecorated}
`

const RaisedLinkButton = RaisedButton.withComponent(Link).extend`
    ${props => props.theme.linkUndecorated}
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

class Button extends React.Component<any, Props, void> {
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
            ? type === 'flat' ? FlatLinkButton : RaisedLinkButton
            : type === 'flat' ? FlatButton : RaisedButton

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

export default Button
