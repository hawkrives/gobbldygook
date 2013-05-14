#include "data-majorSpecialRequirement.hpp"
using namespace std;

bool MajorSpecialRequirement::fulfillsRequirement(const MajorRequirement& c) {
 	for (vector<MajorRequirement>::iterator i=validSets.begin(); i!=validSets.end(); ++i) {
 		if (*i==c)
 			return true;
 	}
 	return false;
}

void MajorSpecialRequirement::incrementHas() {
	++has;
	if (has >= needed)
	  satisfied = true;
	else
	  satisfied = false;
}
