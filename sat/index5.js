const Logic = require('logic-solver')
const assert = require('assert')

// const solver = new Logic.Solver()

function formatLines(stringArray) {
  return JSON.stringify(stringArray).replace(/","/g, '",\n "')
}

function checkClauses(test, f, expected) {
  let s = new Logic.Solver
  f(s)
  test.equal(formatLines(s._clauseStrings()), formatLines(expected))
  console.log(s._clauseStrings())
}

function runClauseTests(test, funcsAndExpecteds) {
  for (let i = 0; i < funcsAndExpecteds.length; i++) {
    let f = funcsAndExpecteds[i]
    i++
    let expected = funcsAndExpecteds[i]
    checkClauses(test, f, expected)
  }
}

// If exactly one of (A, B, C) is true, then A does not equal D.
// let x = Logic.xor('A', 'B')
// solver.forbid(x)

runClauseTests(assert, [
	s => s.forbid(Logic.exactlyOne('A', 'B')),
    ['A v -B', '-A v B'],
])

// let solutions = []
// let curSol
// while ((curSol = solver.solve())) {
//   solutions.push(curSol.getTrueVars())
//   solver.forbid(curSol.getFormula()) // forbid the current solution
// }
//
// console.log(solutions)
