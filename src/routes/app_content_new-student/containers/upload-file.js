import React, {Component, PropTypes} from 'react'
import ScreenToolbar from '../components/screen-toolbar'
import map from 'lodash/map'
import Button from '../../../components/button'

export default class UploadFileScreen extends Component {
	static propTypes = {
		files: PropTypes.array,
		onBack: PropTypes.func.isRequired,
		onNext: PropTypes.func.isRequired,
	};

	render() {
		let {onNext, onBack, files} = this.props
		return <div>
			<header className='header'>
				<h1>Upload a File</h1>
			</header>

			<p>
				Either go ahead and drop a file here, or
				<Button type='raised'>pick one</Button>
				from your computer.
			</p>

			<ul>
				{map(files, file => <li>{JSON.stringify(file)}</li>)}
			</ul>

			<ScreenToolbar onBack={onBack} onNext={onNext} />
		</div>
	}
}
