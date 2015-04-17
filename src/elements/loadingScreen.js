import React from 'react'

class LoadingScreen extends React.Component {
	render() {
		// console.log('LoadingScreen#render')
		return <figure className='loading-screen'>
			<div className='loading-spinner'><div /></div>
			<figcaption className={`loading-message ${this.props.className}`}>{this.props.message}</figcaption>
		</figure>
	}
}
LoadingScreen.propTypes = {
	message: React.PropTypes.string.isRequired,
	className: React.PropTypes.string,
}

export default LoadingScreen
