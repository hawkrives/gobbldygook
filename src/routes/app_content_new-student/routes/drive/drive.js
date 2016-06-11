const React = require('react')
import ScreenToolbar from '../../components/screen-toolbar'

// eslint-disable-next-line react/prefer-stateless-function
export default class DriveLinkScreen extends React.Component {
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
