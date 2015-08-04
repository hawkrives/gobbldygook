import SISData from './sis-degreeaudit.json'
import parseSIS from './parse-sis'

export default function parseDataFromJSON() {
	let parser = new DOMParser()
	let html = parser.parseFromString(SISData.sis, 'text/html')
	return parseSIS(html)
}
