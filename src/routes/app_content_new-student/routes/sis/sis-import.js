import React, {Component, PropTypes} from 'react'

import {checkIfLoggedIn} from '../../../../helpers/import-student'

export default class SISImportScreen extends Component {
	static propTypes = {};

	state = {
		loggedIn: null,
		checkingLogin: true,
	};

	componentWillMount() {
		checkIfLoggedIn()
			.then(() => this.setState({loggedIn: true, checkingLogin: false}))
			.catch(() => this.setState({loggedIn: false, checkingLogin: false}))
	}

	render() {
		return <div>
			<header className='header'>
				<h1>Import from the SIS</h1>
			</header>

			<div>
				{this.state.checkingLogin
					? 'Checking login…'
					: this.state.loggedIn
						? 'Logged in!'
						: 'Not logged in.'}
			</div>
		</div>
	}
}
