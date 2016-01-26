import React, {Component, PropTypes} from 'react'
import serializeError from 'serialize-error'
import getStudentInfo from '../../../../helpers/import-student'
import DOMify from 'react-domify'

export default class SISImportScreen extends Component {
	static propTypes = {};

	state = {
		loggedIn: null,
		checkingLogin: true,
		data: {},
		error: null,
	};

	componentWillMount() {
		getStudentInfo()
			.then(data => this.setState({loggedIn: true, checkingLogin: false, student: data}))
			.catch(err => this.setState({loggedIn: false, checkingLogin: false, error: serializeError(err)}))
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

			{this.state.error ? <pre>{JSON.stringify(this.state.error)}</pre> : null}

			<DOMify value={this.state.student} />
		</div>
	}
}
