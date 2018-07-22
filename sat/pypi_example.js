const {Solver, and, or, atMostOne, not} = require('logic-solver')

const solver = new Solver()

// We first encode these rules into a set of binary expressions to be satisfied:

// Requirement						Boolean expression
// prog-1 requires lib-1 or lib-2	lib-1 or lib-2 or !prog-1
// prog-2 requires lib-2			lib-2 or !prog-2
// lib-1 requires python-2			python-2 or !lib-1
// lib-2 requires python-3			python-3 or !lib-2
// python-3 isn't available			!python-3

// In addition, there are some constraints we always have: we must select a version of the program, and we can't select two different versions of any interface:
//
// Requirement				Boolean expression
// must select some prog	prog-1 or prog-2
// only one prog			at_most_one(prog-1, prog-2)
// only one lib				at_most_one(lib-1, lib-2)
// only one python			at_most_one(python-2, python-3)

let lib1 = 'lib@1'
let lib2 = 'lib@2'
let prog1 = 'prog@1'
let prog2 = 'prog@2'
let py2 = 'python@2'
let py3 = 'python@3'

//

let mustSelectSomeProg = or(prog1, prog2)
let onlyOneProg = atMostOne(prog1, prog2)
let onlyOneLib = atMostOne(lib1, lib2)
let onlyOnePython = atMostOne(py2, py3)

let basicRequirements = and(
	mustSelectSomeProg,
	onlyOneProg,
	onlyOneLib,
	onlyOnePython,
)

//

let prog1requires = or(lib1, lib2, not(prog1))
let prog2requires = or(lib2, not(prog2))
let lib1requires = or(py2, not(lib1))
let lib2requires = or(py3, not(lib2))
let noPy3 = not(py3)

let currentConstraints = and(
	prog1requires,
	prog2requires,
	lib1requires,
	lib2requires,
	noPy3,
)

//

let requirements = and(basicRequirements, currentConstraints)

solver.require(requirements)

console.log(solver._clauseStrings())

//

// let solutions = []
let curSol
console.log('## solutions ##')
while ((curSol = solver.solve())) {
  console.log(curSol.getTrueVars())
  solver.forbid(curSol.getFormula()) // forbid the current solution
}

// console.log(solutions)
