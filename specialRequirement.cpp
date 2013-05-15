#include "specialRequirement.hpp"
using namespace std;

SpecialRequirement::SpecialRequirement() {}
SpecialRequirement::SpecialRequirement(string str) {}
SpecialRequirement::SpecialRequirement(const SpecialRequirement &c) {}
SpecialRequirement SpecialRequirement::operator= (const SpecialRequirement &c) {
	return *this;
}

bool SpecialRequirement::fulfillsRequirement(const MajorRequirement& c) {
 	for (vector<MajorRequirement>::iterator i=validSets.begin(); i!=validSets.end(); ++i) {
 		if (*i == c)
 			return true;
 	}
 	return false;
}

bool operator== (const SpecialRequirement &l, const SpecialRequirement &r) {
	bool parent = (l == r);
	bool valid = (l.validSets == r.validSets);
	return (parent && valid);
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

