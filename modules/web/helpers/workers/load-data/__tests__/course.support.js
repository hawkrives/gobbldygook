export function mockCourse(data={}) {
    return {
        clbid: 1,
        departments: ['DEPT'],
        number: 101,
        instructors: ['B. Name'],
        ...data,
    }
}
