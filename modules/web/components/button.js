// @flow
import React, { Component } from 'react'
import cx from 'classnames'
import Link from 'react-router/lib/Link'

import { compareProps } from '../../lib'
import './button.scss'

type ButtonProps = {
    children?: any,
    className?: string,
    disabled?: boolean,
    link?: boolean,
    onClick?: (Event) => any,
    style?: Object,
    title?: string,
    to?: string | Object,
    type: 'flat' | 'raised',
};

export default class Button extends Component {
    props: ButtonProps;

    static defaultProps = {
        type: 'flat',
    };

    shouldComponentUpdate(nextProps: ButtonProps) {
        return compareProps(this.props, nextProps)
    }

    render() {
        let tag = this.props.link ? Link : 'button'
        let props = {
            type: 'button',
            className: cx(
                'button',
                `button--${this.props.type}`,
                this.props.className
            ),
            disabled: this.props.disabled,
            onClick: this.props.onClick,
            style: this.props.style,
            title: this.props.title,
        }
        if (this.props.link) {
            props = { ...props, to: this.props.to }
        }
        return React.createElement(tag, props, this.props.children)
    }
}
