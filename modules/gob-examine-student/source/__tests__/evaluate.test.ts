import { evaluate } from "../evaluate.ts"
import type { Course, ParsedHansonFile } from "../types.ts"

describe("evaluate", () => {
  it("evaluates!", () => {
    const area: ParsedHansonFile = {
      $type: "requirement",
      name: "Sample Area",
      slug: "sample-area",
      type: "major",
      revision: "0000-01",
      result: { $type: "reference", $requirement: "Req" },
      Req: {
        $type: "requirement",
        result: {
          $type: "course",
          $course: {
            department: ["ASIAN"],
            number: 100,
          },
        },
      },
    }

    const courses: Course[] = []
    const overrides = {}

    expect(() => evaluate({ courses, overrides, area })).not.toThrow()

    expect(evaluate({ courses, overrides, area })).toMatchInlineSnapshot(`
		{
		  "$type": "requirement",
		  "Req": {
		    "$type": "requirement",
		    "computed": false,
		    "result": {
		      "$course": {
		        "department": [
		          "ASIAN",
		        ],
		        "number": 100,
		      },
		      "$type": "course",
		      "_checked": true,
		      "_result": false,
		    },
		  },
		  "computed": false,
		  "name": "Sample Area",
		  "progress": {
		    "at": 0,
		    "of": 0,
		  },
		  "result": {
		    "$requirement": "Req",
		    "$type": "reference",
		    "_checked": true,
		    "_matches": [],
		    "_result": false,
		  },
		  "revision": "0000-01",
		  "slug": "sample-area",
		  "type": "major",
		}
	`)
  })
})
