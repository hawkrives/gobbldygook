// it('doesn\'t mark courses as used unless the requirements are met', () => {
//     const clause = {
//         $type: 'boolean',
//         $and: [
//             {$type: 'course', $course: {department: ['CHEM'], number: 121}},
//             {$type: 'course', $course: {department: ['CHEM'], number: 123}},
//             {$type: 'course', $course: {department: ['CHEM'], number: 125}},
//         ],
//     }
//     const requirement = {result: clause}
//     const courses = [
//         {department: ['CHEM'], name: 'Gen Chemistry/Lab', number: 121, lab: true},
//         {department: ['CHEM'], name: 'Atom/Molec Structure', number: 123},
//     ]
//
//     const result = computeBoolean({expr: clause, ctx: requirement, courses, dirty: new Set()})
//     expect(clause).to.deep.equal({
//         $type: 'boolean',
//         $and: [
//             {
//                 $type: 'course',
//                 department: ['CHEM'],
//                 number: 121,
//             },
//             {
//                 $type: 'course',
//                 department: ['CHEM'],
//                 number: 123,
//             },
//             {
//                 $type: 'course',
//                 department: ['CHEM'],
//                 number: 125,
//             },
//         ],
//     })
//     expect(result).to.have.property('computedResult', false)
// })
