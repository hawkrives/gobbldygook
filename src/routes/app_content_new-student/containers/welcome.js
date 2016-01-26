import React, {PropTypes} from 'react'

import Button from '../../../components/button'
import {FILE_METHOD, SIS_METHOD, MANUAL_METHOD, DRIVE_METHOD} from '../methods'

export default function WelcomeScreen({onNext}) {
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
			<Button type='raised' onClick={() => onNext(SIS_METHOD)}>Import from the SIS</Button>
			<Button disabled type='raised' onClick={() => onNext(DRIVE_METHOD)}>Link to Google Drive</Button>
			<Button type='raised' onClick={() => onNext(FILE_METHOD)}>Upload a File</Button>
			<Button type='raised' onClick={() => onNext(MANUAL_METHOD)}>Create Manually</Button>
		</section>
	</div>
}
WelcomeScreen.propTypes = {
	onNext: PropTypes.func.isRequired,
}
