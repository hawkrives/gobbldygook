// @flow
import React, {PropTypes} from 'react'
import cx from 'classnames'
import isString from 'lodash/isString'

import 'src/components/avatar-letter.scss'

const AvatarLetter = ({className, value=''}: {className?: string, value?: string}) => (
	<div className={cx('avatar-letter', className)}>
		{isString(value) ? value[0] : ''}
	</div>
)

AvatarLetter.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
}

export default AvatarLetter
