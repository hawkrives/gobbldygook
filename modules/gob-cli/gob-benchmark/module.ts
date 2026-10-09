import meow from "meow"
import { evaluate } from "@gob/examine-student"
import type {
  Course,
  OverridesObject,
  ParsedHansonFile,
} from "@gob/examine-student"
import ms from "pretty-ms"
import range from "lodash/range"
import sparkly from "sparkly"
import mean from "lodash/mean"
import { loadStudent } from "../lib/load-student"

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- process.hrtime() only accepts a mutable [number, number] tuple
function now(other?: [number, number]) {
  let time = process.hrtime(other)
  return time[0] * 1e3 + time[1] / 1e6
}

// oxlint-disable-next-line typescript/prefer-readonly-parameter-types -- evaluate() writes its results onto area's expressions and takes a mutable courses array
function benchmarkArea({
  area,
  courses,
  overrides,
  runs,
  graph,
}: {
  area: ParsedHansonFile
  courses: Array<Course>
  overrides: OverridesObject
  runs: number
  graph: boolean
}) {
  let { name, type, revision } = area
  console.log(`the '${String(name)}' ${String(type)} (${String(revision)})`)

  let times = range(runs).map(() => {
    const start = process.hrtime()
    evaluate({ area, courses, overrides })
    return now(start)
  })

  const avg = mean(times)
  if (graph) {
    console.log(`  ${sparkly(times, { minimum: 0 })}`)
  }
  console.log(`  average time: ${ms(avg)} (over ${runs} runs)\n`)
}

async function benchmark({
  runs,
  graph,
  files,
}: Readonly<{
  runs: number
  graph: boolean
  files: ReadonlyArray<string>
}>) {
  let loadedFiles = await Promise.all(files.map((file) => loadStudent(file)))

  for (const { student, areas, courses, overrides } of loadedFiles) {
    console.log(`## ${student.name} (${student.id}) ##`)
    for (const area of areas) {
      benchmarkArea({ area, courses, overrides, runs, graph })
    }
  }
}

export default async function main() {
  const args = meow(
    `
		usage: gob-benchmark <student-file> [student-file ...[student-file]]

		arguments:
			--runs [default: 50]
			--graph [default: true]
			--debug
	`,
    {
      flags: {
        runs: { type: "number", default: 50 },
        graph: { type: "boolean", default: true },
        debug: { type: "boolean", default: false },
      },
    },
  )

  if (args.flags.debug) {
    console.log(args)
  }

  let { runs, graph } = args.flags

  await benchmark({ runs, graph, files: args.input })
}
