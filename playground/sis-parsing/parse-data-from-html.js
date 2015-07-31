import parseSIS from './parse-sis'

export default function parseDataFromHTML() {
	let html = document.querySelector('#sis')
	return parseSIS(html)
}
