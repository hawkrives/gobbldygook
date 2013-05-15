#include "data-majorSpecialRequirement.hpp"
using namespace std;

MajorSpecialRequirement::MajorSpecialRequirement() {
	init("", 0);
};

MajorSpecialRequirement::MajorSpecialRequirement(istream &is) {
};

MajorSpecialRequirement::MajorSpecialRequirement(const MajorSpecialRequirement &c) {
	copy(c);
};

MajorSpecialRequirement MajorSpecialRequirement::operator= (const MajorSpecialRequirement &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
};

void MajorSpecialRequirement::init(string n, int need) {
	name = n;
	needed = need;
	has = 0;
	satisfied = false;
	validSets;
};
void MajorSpecialRequirement::copy(const MajorSpecialRequirement &c) {
	name = c.name;
	needed = c.needed;
	has = c.has;
	satisfied = c.satisfied;
	validSets = c.validSets;
};

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
