import React, {Component, PropTypes} from 'react'
import Button from '../../../components/button'

import './new-student.scss'

const SIS_METHOD = 'sis'
const DRIVE_METHOD = 'sis'
const FILE_METHOD = 'sis'
const MANUAL_METHOD = 'sis'

function WelcomeScreen({onNextScreen}) {
	return <div>
		<header className='header'>
			<h1>Hi there!</h1>
			<h2>I don't know anything about you. Care to enlighten me?</h2>
		</header>
		<section className='body'>
			<p>
				We need to know:
			</p>
			<ul>
				<li>what year you entered the college,</li>
				<li>when you plan on graduating from the college,</li>
				<li>what you want to major in,</li>
				<li>and anything you've already taken.</li>
			</ul>
			<p>
				We have a few ways to do that: you can import your data from the SIS,
				you can link up to a previous file on Google Drive,
				you can upload an exported file,
				or you can just fill everything out manually.
			</p>
		</section>
		<section className='choices'>
			<Button type='raised' onClick={() => onNextScreen(SIS_METHOD)}>Import from the SIS</Button>
			<Button type='raised' disabled onClick={() => onNextScreen(DRIVE_METHOD)}>Link to Google Drive</Button>
			<Button type='raised' onClick={() => onNextScreen(FILE_METHOD)}>Upload a File</Button>
			<Button type='raised' onClick={() => onNextScreen(MANUAL_METHOD)}>Create Manually</Button>
		</section>
	</div>
}

function SISImportScreen({onNextScreen, onPreviousScreen}) {
	return <div>
		<Button type='raised' onClick={onPreviousScreen}>Back</Button>
		Import from the SIS
		<section>
			<Button type='raised' onClick={onNextScreen}>Next</Button>
		</section>
	</div>
}

function DriveLinkScreen({onNextScreen, onPreviousScreen}) {
	return <div>
		<Button type='raised' onClick={onPreviousScreen}>Back</Button>
		Link to Google Drive
		<section>
			<Button type='raised' onClick={onNextScreen}>Next</Button>
		</section>
	</div>
}

function UploadFileScreen({onNextScreen, onPreviousScreen}) {
	return <div>
		<Button type='raised' onClick={onPreviousScreen}>Back</Button>
		Uplaod a File
		<section>
			<Button type='raised' onClick={onNextScreen}>Next</Button>
		</section>
	</div>
}

function ManualCreationScreen({onNextScreen, onPreviousScreen}) {
	return <div>
		<Button type='raised' onClick={onPreviousScreen}>Back</Button>
		Manually Create
		<section>
			<Button type='raised' onClick={onNextScreen}>Next</Button>
		</section>
	</div>
}

export default class NewStudent extends Component {
	state = {
		method: null,
	};

	handleChooseScreen = method => {
		this.setState({method})
	};

	revertToChooseScreen = () => {
		this.setState({method: null})
	};

	render() {
		let screen = null
		if (!this.state.method) {
			screen = <WelcomeScreen onNextScreen={this.handleChooseScreen} />
		}
		else if (this.state.method === SIS_METHOD) {
			screen = <SISImportScreen onComplete={this.importFromSIS} onPreviousScreen={this.revertToChooseScreen} />
		}
		else if (this.state.method === DRIVE_METHOD) {
			screen = <DriveLinkScreen onComplete={this.importFromDrive} onPreviousScreen={this.revertToChooseScreen} />
		}
		else if (this.state.method === FILE_METHOD) {
			screen = <UploadFileScreen onComplete={this.importFromFile} onPreviousScreen={this.revertToChooseScreen} />
		}
		else if (this.state.method === MANUAL_METHOD) {
			screen = <ManualCreationScreen onComplete={this.importFromManual} onPreviousScreen={this.revertToChooseScreen} />
		}

		return (
			<div className='new-student'>
				{screen}
			</div>
		)
	}
}
