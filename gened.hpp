#ifndef __gobbldygook__gened__
#define __gobbldygook__gened__

#include "general.hpp"
#include "requirement.hpp"

class GenEd : public Requirement {
public:
	GenEd() : GenEd("", 0) {}
	GenEd(string str) : GenEd(str, 0) {}
	GenEd(string str, int n) : Requirement(str, n) {}

//	bool fulfillsRequirement(const ID& c);
//	void addCourse(const ID& c);

//	friend bool operator== (const GenEd &l, const GenEd&r);
//	friend bool operator!= (const GenEd &l, const GenEd &r);
//	friend bool operator== (const GenEd &l, const Requirement &r);
//	friend bool operator!= (const GenEd &l, const Requirement &r);

//	ostream& getData(ostream &os);
//	void display();
};

//ostream &operator<<(ostream &os, GenEd &item);

#endif /* defined(__gobbldygook__gened__) */
