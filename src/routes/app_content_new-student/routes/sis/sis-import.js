import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../../components/screen-toolbar'

export default class SISImportScreen extends Component {
	static propTypes = {};

	render() {
		return <div>
			<header className='header'>
				<h1>Import from the SIS</h1>
			</header>

			<ScreenToolbar />
		</div>
	}
}
