const Logic = require('logic-solver')

const solver = new Logic.Solver()

solver.require(Logic.exactlyOne('1,1', '1,2', '1,3'))

// console.log(solver._clauseStrings())

let solutions = []
let curSol
while ((curSol = solver.solve())) {
  solutions.push(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}

console.log(solutions)
