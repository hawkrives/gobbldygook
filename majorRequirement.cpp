#include "majorRequirement.hpp"
using namespace std;

void MajorRequirement::init() {}

MajorRequirement::MajorRequirement() {
	init();
}
MajorRequirement::MajorRequirement(string str) {
}
MajorRequirement::MajorRequirement(const MajorRequirement &c) {}
MajorRequirement MajorRequirement::operator= (const MajorRequirement &c) {
	return *this;
}

bool MajorRequirement::fulfillsRequirement(const ID& c) {
 	for (vector<ID>::iterator i=validCourses.begin(); i!=validCourses.end(); ++i) {
 		if (*i==c)
 			return true;
 	}
 	return false;
}

bool operator== (const MajorRequirement &l, const MajorRequirement &r) {
	bool parent = (l == r);
	bool valid = (l.validCourses == r.validCourses);
	return (parent && valid);
}

bool operator!= (const MajorRequirement &l, const MajorRequirement &r) {
	return !(l == r);
}

bool operator== (const MajorRequirement &l, const Requirement &r) {
	return false;
}

bool operator!= (const MajorRequirement &l, const Requirement &r) {
	return !(l == r);
}
