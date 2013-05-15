#include "majorRequirement.hpp"
using namespace std;

bool MajorRequirement::fulfillsRequirement(const ID& c) {
 	for (vector<ID>::iterator i=validCourses.begin(); i!=validCourses.end(); ++i) {
 		if (*i==c)
 			return true;
 	}
 	return false;
}

void MajorRequirement::incrementHas() {
	++has;
	if (has >= needed)
	  satisfied = true;
	else
	  satisfied = false;
}
