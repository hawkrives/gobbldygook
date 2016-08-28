import React, { PropTypes } from 'react'
import {auth} from 'src/google-platform'

function triggerSignin(callback) {
	auth().signIn().then(callback)
}

const style = {
	display: 'inline-block',
	background: '#d14836',
	color: '#fff',
	width: 190,
	paddingTop: 10,
	paddingBottom: 10,
	borderRadius: 2,
	border: '1px solid transparent',
	fontSize: 16,
	fontWeight: 'bold',
	fontFamily: 'Roboto',
}

function GoogleLogin(props) {
	const { className, children, callback } = props
	return (
		<button
			className={className}
			onClick={() => triggerSignin(callback)}
			style={style}
		>
			{children}
		</button>
	)
}

GoogleLogin.propTypes = {
	callback: PropTypes.func.isRequired,
	children: React.PropTypes.node.isRequired,
	className: PropTypes.string,
	scope: PropTypes.string,
}

GoogleLogin.defaultProps = {
	scope: 'profile email',
	redirectUri: 'postmessage',
	cookiePolicy: 'single_host_origin',
}

export default GoogleLogin
