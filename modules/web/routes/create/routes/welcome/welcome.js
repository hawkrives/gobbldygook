import React from 'react'
import Button from 'modules/web/components/button'

export default function WelcomeScreen() {
	return <div>
		<header className="header">
			<h1>Hi there!</h1>
			<h2>I don't know anything about you. Care to enlighten me?</h2>
		</header>
		<section className="body">
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
		<section className="choices">
			<Button link type="raised"
				to="/create/sis"
			>
				Import from the SIS
			</Button>
			<Button disabled link type="raised"
				to="/create/drive"
				onClick={ev => ev.preventDefault()}
			>
				Link to Google Drive
			</Button>
			<Button link type="raised"
				to="/create/upload"
			>
				Upload a File
			</Button>
			<Button link type="raised"
				to="/create/manual"
			>
				Create Manually
			</Button>
		</section>
	</div>
}
