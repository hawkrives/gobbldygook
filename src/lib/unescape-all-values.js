import isArray from 'lodash/lang/isArray'
import isString from 'lodash/lang/isString'
import map from 'lodash/collection/map'
import mapValues from 'lodash/object/mapValues'
import unescape from 'lodash/string/unescape'

export default function unescapeAllValues(obj) {
	return (isArray(obj) ? map : mapValues)(obj, (value) => {
		if (isString(value)) {
			return unescape(value)
		}
		else if (isArray(value)) {
			return unescapeAllValues(value)
		}
		return value
	})
}
