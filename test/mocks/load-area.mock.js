export default function loadAreaMock({name, type, revision}) {
	return Promise.resolve({
		name,
		type,
		revision,
	})
}
