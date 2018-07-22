const {Solver, and, or, atMostOne} = require('logic-solver')

const solver = new Solver()

let requirements = and(
	// requirement 1
	or('r1#course1', 'r1#course2'),
	// requirement 2
	and('r2#course1', 'r2#course3'),
	// constraint: no course can count for two requirements
	atMostOne('r1#course1', 'r2#course1'),
)

//

solver.require(requirements)

// console.log(solver._clauseStrings())

//

let curSol
console.log('## solutions ##')
while ((curSol = solver.solve())) {
  console.log(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}
