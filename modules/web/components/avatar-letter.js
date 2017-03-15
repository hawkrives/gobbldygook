// @flow
import React from 'react'
import cx from 'classnames'
import isString from 'lodash/isString'

import './avatar-letter.scss'

const AvatarLetter = (
    { className, value = '' }: { className?: string, value: string }
) => (
    <div className={cx('avatar-letter', className)}>
        {isString(value) ? value[0] : ''}
    </div>
)

export default AvatarLetter
