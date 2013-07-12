#include "specialRequirement.hpp"

bool SpecialRequirement::fulfillsRequirement(const MajorRequirement& c) {
 	for (MajorRequirement i : validSets)
 		if (i == c)
 			return true;

 	return false;
}

void SpecialRequirement::addSet(MajorRequirement mr) {
	validSets.push_back(mr);
}

const vector<MajorRequirement> SpecialRequirement::getValidSets() const {
	return validSets;
}

bool operator== (const SpecialRequirement &l, const SpecialRequirement &r) {
//	bool parent = (l == r);
	bool valid = (l.validSets == r.validSets);
	return (valid);
}

bool operator!= (const SpecialRequirement &l, const SpecialRequirement &r) {
	return !(l == r);
}

bool operator== (const SpecialRequirement &l, const Requirement &r) {
	return false;
}

bool operator!= (const SpecialRequirement &l, const Requirement &r) {
	return !(l == r);
}

ostream &operator<<(ostream &os, SpecialRequirement &item) {
	return item.getData(os);
}
