#include "specialRequirement.hpp"

void SpecialRequirement::init(string n) {
	Requirement::init(n, 0);
}

void SpecialRequirement::copy(const SpecialRequirement &c) {
	Requirement::copy(c);
	validSets = c.validSets;
}

SpecialRequirement::SpecialRequirement() : Requirement() {}
SpecialRequirement::SpecialRequirement(string str) : Requirement(str) {}
SpecialRequirement::SpecialRequirement(string str, int n) : Requirement(str, n) {}
SpecialRequirement::SpecialRequirement(const SpecialRequirement &c) {
	copy(c);
}

SpecialRequirement SpecialRequirement::operator= (const SpecialRequirement &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

bool SpecialRequirement::fulfillsRequirement(const MajorRequirement& c) {
 	for (vector<MajorRequirement>::iterator i=validSets.begin(); i!=validSets.end(); ++i) {
 		if (*i == c)
 			return true;
 	}
 	return false;
}

void SpecialRequirement::addSet(const MajorRequirement& mr) {
	validSets.push_back(mr);
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

//ostream& SpecialRequirement::getData(ostream &os) {
//	os << name;
//	os << " needs " << needed;
//	os << ", but has " << has;
//	os << ", therefore it is ";
//	if (satisfied)
//		os << "satisfied.";
//	else
//		os << "not satisfied.";
//	return os;
//}

ostream &operator<<(ostream &os, SpecialRequirement &item) {
	return item.getData(os);
}

void SpecialRequirement::display() {
	cout << *this << endl;
}
