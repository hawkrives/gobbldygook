import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../../components/screen-toolbar'

export default class DriveLinkScreen extends Component {
	static propTypes = {};

	render() {
		return <div>
			<header className='header'>
				<h1>Link to Google Drive</h1>
			</header>

			<p>
				Unfortunately, this functionality has not yet been built.
			</p>

			<ScreenToolbar />
		</div>
	}
}
