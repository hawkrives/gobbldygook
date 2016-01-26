import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../components/screen-toolbar'

export default class DriveLinkScreen extends Component {
	static propTypes = {
		onBack: PropTypes.func.isRequired,
		onNext: PropTypes.func.isRequired,
	};

	render() {
		let {onNext, onBack} = this.props
		return <div>
			<header className='header'>
				<h1>Link to Google Drive</h1>
			</header>

			<p>
				Unfortunately, this functionality has not yet been built.
			</p>

			<ScreenToolbar onBack={onBack} onNext={onNext} />
		</div>
	}
}
