// @flow
import * as React from 'react'
import Link from 'react-router/lib/Link'
import styled from 'styled-components'
import * as c from '../styles/colors'
import * as m from '../styles/mixins'
import * as v from '../styles/variables'

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
    border-radius: ${v.baseBorderRadius};
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
    ${m.materialShadow} background-color: ${c.white};

    &:hover {
        background-color: ${c.white};
    }
    &:focus {
        background-color: ${c.blue50};
        border-color: ${c.blue300};
    }

    &:active {
        ${m.materialShadow} background-color: ${c.white};
    }

    &[disabled] {
        cursor: default;
        color: ${c.gray500};
    }
`

const FlatButton = BaseButton.extend`
    background-color: transparent;

    &:hover {
        background-color: ${c.gray100};
        border-color: ${c.gray400};
    }

    &:focus {
        background-color: ${c.blue50};
        border-color: ${c.blue300};
    }

    &[disabled] {
        cursor: default;
        color: ${c.disabledForegroundLight};

        &:hover,
        &:focus,
        &:active {
            border-color: transparent;
            background-color: transparent;
        }
    }
`

const FlatLinkButton = FlatButton.withComponent(Link).extend`
    ${m.linkUndecorated}
`

const RaisedLinkButton = RaisedButton.withComponent(Link).extend`
    ${m.linkUndecorated}
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
