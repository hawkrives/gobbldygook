import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../components/screen-toolbar'

export default class ManualCreationScreen extends Component {
	static propTypes = {
		onBack: PropTypes.func.isRequired,
		onNext: PropTypes.func.isRequired,
	};

	render() {
		let {onNext, onBack} = this.props
		return <div>
			<header className='header'>
				<h1>Manually Create</h1>
			</header>

			<ScreenToolbar onBack={onBack} onNext={onNext} />
		</div>
	}
}
