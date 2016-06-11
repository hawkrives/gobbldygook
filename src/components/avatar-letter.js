const React = require('react')
const {PropTypes} = React
const cx = require('classnames')
import {isString} from 'lodash-es'

// import './avatar-letter.css'

const AvatarLetter = ({className, value=''}) => (
	<div className={cx('avatar-letter', className)}>
		{isString(value) ? value[0] : ''}
	</div>
)

AvatarLetter.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
}

export default AvatarLetter
