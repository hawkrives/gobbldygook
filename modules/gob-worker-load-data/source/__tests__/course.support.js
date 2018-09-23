export function mockCourse(data = {}) {
	return {
		clbid: 1,
		department: 'DEPT',
		number: 101,
		instructors: ['B. Name'],
		...data,
	}
}
