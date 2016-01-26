import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../../components/screen-toolbar'

export default class ManualCreationScreen extends Component {
	static propTypes = {};

	render() {
		return <div>
			<header className='header'>
				<h1>Manually Create</h1>
			</header>

			<ScreenToolbar />
		</div>
	}
}
