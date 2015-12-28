export default async function loadAreaMock({name, type, revision, _shouldError=false}) {
	if (_shouldError) {
		throw new Error('Error!')
	}
	return {
		name,
		type,
		revision,
	}
}
