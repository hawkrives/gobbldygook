import React from 'react'
import {RaisedLinkButton} from '../../components/button'

export default function WelcomeScreen() {
	return (
		<div>
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
				<RaisedLinkButton to="/create/sis">
					Import from the SIS
				</RaisedLinkButton>
				<RaisedLinkButton
					disabled
					to="/create/drive"
					onClick={ev => ev.preventDefault()}
				>
					Link to Google Drive
				</RaisedLinkButton>
				<RaisedLinkButton to="/create/upload">
					Upload a File
				</RaisedLinkButton>
				<RaisedLinkButton to="/create/manual">
					Create Manually
				</RaisedLinkButton>
			</section>
		</div>
	)
}
