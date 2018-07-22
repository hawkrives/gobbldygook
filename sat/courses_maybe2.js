const {Solver, and, or, atMostOne, not} = require('logic-solver')

const solver = new Solver()

let requirements = and(
	and('r1', or('r1-course1', 'r1-course2')),
	and('r2', and('r2-course1', 'r2-course3')),
	atMostOne('r1-course1', 'r2-course1'),
)

//

solver.require(requirements)

console.log(solver._clauseStrings())

//

let curSol
console.log('## solutions ##')
while ((curSol = solver.solve())) {
  console.log(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}
