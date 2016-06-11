const React = require('react')
const {PropTypes} = React
const cx = require('classnames')

// import './loading.css'

export default function Loading({className, children}) {
	return (
		<figure className='loading…'>
			<div className='loading-spinner'><div /></div>
			<figcaption className={cx('loading-message', className)}>
				{children}
			</figcaption>
		</figure>
	)
}

Loading.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
}
