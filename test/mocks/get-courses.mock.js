import map from 'lodash/map'

export default function getCoursesMock(clbids, {year, semester}={}) {
	return Promise.resolve(map(clbids, id => ({clbid: id, year, semester})))
}
