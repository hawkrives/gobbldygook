import db from '../../helpers/db'

import {
	LOAD_AREAS,
} from '../constants/areas'

export function loadAreas() {
	let areasPromise = db.store('areas').getAll()
	return { type: LOAD_AREAS, payload: areasPromise }
}
