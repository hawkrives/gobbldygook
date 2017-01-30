// @flow
import React from 'react'
import cx from 'classnames'
import isString from 'lodash/isString'

const size = '48px'

const AvatarLetter = ({ className, value='' }: {className?: string, value: string}) => (
	<div className={cx('avatar-letter', className)}>
		{isString(value) ? value[0] : ''}
    <style jsx>{`
      .avatar-letter {
        font-family: Fira Sans, Helvetica Neue, Helvetica, Arial, sans-serif !important;
        font-weight: 200;
        font-style: normal;

        text-align: center;
        text-transform: uppercase;

        display: inline-block;

        padding: 0;
        width: ${size};
        height: ${size};
        line-height: ${size};
        font-size: calc((${size} / 3) * 2);

        border-radius: ${size};
      }
    `}</style>
	</div>
)

export default AvatarLetter
