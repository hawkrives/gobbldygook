import {
	LOAD_AREAS,
} from '../constants/areas'

import db from '../../helpers/db'

export async function loadAreas() {
	let areas = await db.store('areas').all()
	return { type: LOAD_AREAS, payload: areas }
}
