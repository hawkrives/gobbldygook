#include "majorRequirement.hpp"
using namespace std;

void MajorRequirement::init(string n) {
	Requirement::init(n, 0);
}

void MajorRequirement::copy(const MajorRequirement &c) {
	Requirement::copy(c);
	validCourses = c.validCourses;
}

MajorRequirement::MajorRequirement() : Requirement() {}
MajorRequirement::MajorRequirement(string str) : Requirement(str) {}
MajorRequirement::MajorRequirement(string str, int n) : Requirement(str, n) {}
MajorRequirement::MajorRequirement(const MajorRequirement &c) {
	copy(c);
}
MajorRequirement MajorRequirement::operator= (const MajorRequirement &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

bool MajorRequirement::fulfillsRequirement(const ID& c) {
 	for (vector<ID>::iterator i=validCourses.begin(); i!=validCourses.end(); ++i) {
 		if (*i==c)
 			return true;
 	}
 	return false;
}

void MajorRequirement::addCourse(const ID& c) {
	validCourses.push_back(c);
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

ostream& MajorRequirement::getData(ostream &os) {
	os << name;
	os << " needs " << needed;
	os << ", but has " << has;
	os << ", therefore it is ";
	if (satisfied)
		os << "satisfied.";
	else
		os << "not satisfied.";
	return os;
}

ostream &operator<<(ostream &os, MajorRequirement &item) {
	return item.getData(os);
}

void MajorRequirement::display() {
	cout << *this << endl;
}
