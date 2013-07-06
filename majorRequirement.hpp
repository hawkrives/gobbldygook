#ifndef __Data_majorRequirement__
#define __Data_majorRequirement__

#include "general.hpp"
#include "requirement.hpp"
using namespace std;

class MajorRequirement : public Requirement {
protected:
	vector<ID> validCourses;

public:
	MajorRequirement() : MajorRequirement("", 0) {}
	MajorRequirement(string str) : MajorRequirement(str, 0) {}
	MajorRequirement(string str, int n) : Requirement(str, n) {}

	void addCourse(const ID& c);
	bool fulfillsRequirement(const ID& c) const;

	friend bool operator== (const MajorRequirement &l, const MajorRequirement&r);
	friend bool operator!= (const MajorRequirement &l, const MajorRequirement &r);
};

ostream &operator<<(ostream &os, MajorRequirement &item);

inline bool operator== (const MajorRequirement &l, const MajorRequirement &r) {
	bool parent = (l == r);
	bool valid = (l.validCourses == r.validCourses);
	return (parent && valid);
}

inline bool operator!= (const MajorRequirement &l, const MajorRequirement &r) {
	return !(l == r);
}

#endif
