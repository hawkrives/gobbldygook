const Logic = require('logic-solver')

const solver = new Logic.Solver()

solver.require(Logic.atMostOne('Alice', 'Bob'))
solver.require(Logic.or('Bob', 'Charlie'))

let solutions = []
let curSol
while ((curSol = solver.solve())) {
  solutions.push(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}

console.log(solutions)
