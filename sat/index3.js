const Logic = require('logic-solver')

const solver = new Logic.Solver()

// req1: c1 | c2
// req2: c1 & c3
// solution: req1 = c2; req2 = c1, c3;

solver.require(Logic.and('a', Logic.not('b')))
// solver.require(Logic.or('Bob', 'Charlie'))

// solver.require(Logic.implies('req1', Logic.or('c1', 'c2')))
// solver.require(Logic.implies('req2', Logic.and('c1', 'c3')))

let solutions = []
let curSol
while ((curSol = solver.solve())) {
  solutions.push(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}

console.log(solutions)
