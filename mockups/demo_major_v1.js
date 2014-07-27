{
	"info": {
		"title": "Asian Studies",
		"abbr": "ASIAN",
		"dept": "ASIAN",
		"type": "major",

		"sets": [
			{
				"comment": "Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)",
				"description": "Independent Approaches to Asia",
				"needs": true,
				"reqs": [
					{"courses": ["ASIAN 275"], "needs": true}
				]
			},
			{
				"comment": "Six electives, with stipulations:",
				"description": "Electives",
				"count": 6,
				"reqs": [
					{	"comment": "1. At least two at level II or level III, taken on campus;",
						"query": "'ASIAN' IN depts AND level >= 200", "needs": 2 },

					{	"comment": "2. No more than two at level I;",
						"query": "'ASIAN' IN depts AND level == 100", "max": 2 },

					{	"comment": "3. No more than four elective courses about any one country;"
						"reqgroup": [
							{"query": "'ASIAN' IN depts AND 'China' IN title", "max": 4},
							{"query": "'ASIAN' IN depts AND 'Japan' IN title", "max": 4},
						], 
						"needs": true },

					{	"comment": "4. No level I or level II language courses may count."
						"query": "'ASIAN' IN depts AND ('Beginner' OR 'Intermediate') IN title AND level < 300 AND NOT crsid IN {{ validCrsids }}", "max": 0 }
				]
			},
			{
				"comment": "Senior Seminar: Asian Studies 399: Asian Studies Seminar or 397: Human Rights/Asian Context",
				"description": "Senior Seminar",
				"needs": true,
				"reqs": [
					{"courses": ["ASIAN 397", "ASIAN 399"], "needs": 1}
				]
			},
			{
				"comment": "Two courses in Chinese or Japanese above 112 or its equivalent",
				"description": "Language",
				"needs": 1,
				"reqs": [
					{"query": "'JAPAN' IN depts AND level >= 200 AND ('Intermediate' OR 'Advanced' OR 'Japanese') IN title", "needs": 2},
					{"query": "'CHIN' IN depts AND level >= 200 AND ('Intermediate' OR 'Advanced' OR 'Chinese') IN title", "needs": 2}
				]
			}
		]
	}
}
