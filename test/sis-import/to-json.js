import parseSIS from '../../src/lib/parse-sis'

document.querySelector('.app').onsubmit = ev => {
	ev.preventDefault()

	const parsed = parseSIS(ev.target)
	document.querySelector('.output').innerHTML = JSON.stringify(parsed, null, 2)
	window.parsed = parsed
	console.log(parsed)
}

// document.querySelector('.content').innerHTML = JSON.stringify()
