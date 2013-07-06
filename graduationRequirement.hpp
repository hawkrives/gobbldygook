#ifndef __gobbldygook__graduationRequirement__
#define __gobbldygook__graduationRequirement__

#include "general.hpp"
#include "gened.hpp"

struct GraduationRequirement {
	int creditsNeeded = 35;
	int creditsTaken = 0;

	GenEd introduction = GenEd("FYW", 1);
	GenEd writing = GenEd("WRI", 4);
	// TODO: Support requirements that have a variable number of courses needed.
	GenEd language = GenEd("FOL", 4);
	GenEd communication = GenEd("ORC", 1);
	GenEd reasoning = GenEd("AQR", 1);
	// TODO: support using 'number of courses' instead of 'number of credits'
	GenEd movement = GenEd("SPM", 2);
	GenEd history = GenEd("HWC", 1);
	// TODO: support requiring that courses be from different departments
	GenEd global = GenEd("MCG", 1);
	GenEd domestic = GenEd("MCD", 1);
	GenEd art = GenEd("ALS-A", 1);
	GenEd literature = GenEd("ALS-L", 1);
	GenEd bible = GenEd("BTS-B", 1);
	GenEd theology = GenEd("BTS-T", 1);
	GenEd exploration = GenEd("SED", 1);
	GenEd topics = GenEd("IST", 1);
	GenEd humans = GenEd("HBS", 1);
	GenEd ethics = GenEd("EIN", 1);
};

#endif /* defined(__gobbldygook__graduationRequirement__) */
