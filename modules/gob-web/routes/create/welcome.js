// @flow

import * as React from 'react'
import Link from 'react-router/lib/Link'
import {RaisedButton} from '../../components/button'

export default function WelcomeScreen() {
	return (
		<>
			<header className="header">
				<h1>Hi there!</h1>
				<h2>I don't know anything about you. Care to enlighten me?</h2>
			</header>
			<section className="body">
				<p>We need to know:</p>
				<ul>
					<li>what year you entered the college,</li>
					<li>when you plan on graduating from the college,</li>
					<li>what you want to major in,</li>
					<li>and anything you've already taken.</li>
				</ul>
				<p>
					We have a few ways to do that: you can import your data from
					the SIS, you can link up to a previous file on Google Drive,
					you can upload an exported file, or you can just fill
					everything out manually.
				</p>
			</section>
			<section className="choices">
				<RaisedButton as={Link} to="/create/sis">
					Import from the SIS
				</RaisedButton>
				<RaisedButton
					as={Link}
					disabled
					to="/create/drive"
					onClick={ev => ev.preventDefault()}
				>
					Link to Google Drive
				</RaisedButton>
				<RaisedButton as={Link} to="/create/upload">
					Upload a File
				</RaisedButton>
				<RaisedButton as={Link} to="/create/manual">
					Create Manually
				</RaisedButton>
			</section>
		</>
	)
}
