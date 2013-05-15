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

bool operator== (const MajorSpecialRequirement &msr1, const MajorSpecialRequirement &msr2) {
    return (msr1.name == msr2.name);
}

bool operator!= (MajorSpecialRequirement &msr1, MajorSpecialRequirement &msr2) {
    return !(msr1 == msr2);
}