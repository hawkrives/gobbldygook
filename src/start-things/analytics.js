export function isogram() {
	window.GoogleAnalyticsObject = 'ga'
	window.ga = {
		q: [['create', 'UA-10662325-7', 'auto'], ['send', 'pageview']],
		l: Number(new Date()),
	}

	let script = document.createElement('script')
	script.async = true
	script.src = '//www.google-analytics.com/analytics.js'
	document.body.appendChild(script)
}

if (process.env.NODE_ENV === 'production') {
	console.log('Initializing analytics 📊')
	isogram()
}
