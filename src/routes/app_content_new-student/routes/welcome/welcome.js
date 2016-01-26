import React from 'react'
import {Link} from 'react-router'

import Button from '../../../../components/button'
import {FILE_METHOD, SIS_METHOD, MANUAL_METHOD, DRIVE_METHOD} from '../../methods'

export default function WelcomeScreen() {
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
			<Link to='/create/sis'>
				<Button type='raised'>
					Import from the SIS
				</Button>
			</Link>
			<Link to='/create/drive' onClick={ev => ev.preventDefault()}>
				<Button disabled type='raised'>
					Link to Google Drive
				</Button>
			</Link>
			<Link to='/create/upload'>
				<Button type='raised'>
					Upload a File
				</Button>
			</Link>
			<Link to='/create/manual'>
				<Button type='raised'>
					Create Manually
				</Button>
			</Link>
		</section>
	</div>
}
