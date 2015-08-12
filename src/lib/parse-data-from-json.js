import parseSIS from './parse-sis'

export default function parseDataFromJSON(jsonData) {
	let parser = new DOMParser()
	let html = parser.parseFromString(jsonData.sis, 'text/html')
	return parseSIS(html)
}
