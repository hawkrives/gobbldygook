import React, {Component, PropTypes} from 'react'
import DropZone from 'react-dropzone'

import WelcomeScreen from './welcome'
import SISImportScreen from './sis-import'
import UploadFileScreen from './upload-file'
import DriveLinkScreen from './drive-link'
import ManualCreationScreen from './manual'

import {FILE_METHOD, SIS_METHOD, MANUAL_METHOD, DRIVE_METHOD} from '../methods'
import './new-student.scss'


export default class NewStudent extends Component {
	static propTypes = {};

	state = {
		method: null,
		data: null,
		files: null,
	};

	componentDidMount() {
		this.preventGlobalDrop()
	}

	handleChooseScreen = method => {
		this.setState({method})
	};

	revertToChooseScreen = () => {
		this.setState({method: null})
	};

	importFromFile = file => {
		console.log('importFromFile', file)
		// this.setState({})
	};

	handleFileDrop = files => {
		this.setState({files, method: FILE_METHOD})
		// forEach(files, this.importFromFile)
	};

	preventGlobalDrop() {
		if (typeof window === 'undefined') {
			return
		}

		window.addEventListener('dragover', e => e.preventDefault())
		window.addEventListener('drop', e => e.preventDefault())
	}

	render() {
		console.log(this.state)
		let screen = null
		if (!this.state.method) {
			screen = <WelcomeScreen onNext={this.handleChooseScreen} />
		}
		else if (this.state.method === SIS_METHOD) {
			screen = <SISImportScreen
				onComplete={this.importFromSIS}
				onBack={this.revertToChooseScreen}
			/>
		}
		else if (this.state.method === DRIVE_METHOD) {
			screen = <DriveLinkScreen
				onComplete={this.importFromDrive}
				onBack={this.revertToChooseScreen}
			/>
		}
		else if (this.state.method === FILE_METHOD) {
			screen = <UploadFileScreen
				onComplete={this.importFromFile}
				onBack={this.revertToChooseScreen}
			/>
		}
		else if (this.state.method === MANUAL_METHOD) {
			screen = <ManualCreationScreen
				onComplete={this.importFromManual}
				onBack={this.revertToChooseScreen}
			/>
		}

		return (
			<DropZone
				ref={c => (this._dropzone = c)}
				className='dropzone'
				activeClassName='dropzone-active'
				accept='application/json'
				onDrop={this.handleFileDrop}
				multiple
				disableClick
			>
			<div className='new-student'>
				{screen}
			</div>
			</DropZone>
		)
	}
}
