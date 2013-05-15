#ifndef __Data_majorRequirement__
#define __Data_majorRequirement__

#include "general.hpp"
#include "requirement.hpp"
using namespace std;

class MajorRequirement : public Requirement {
private:
	void init();
	void copy(const MajorRequirement &c);
	vector<ID> validCourses;
public:
	MajorRequirement();
	MajorRequirement(string str);
	MajorRequirement(const MajorRequirement &c);
	MajorRequirement operator= (const MajorRequirement &c);
	
	bool fulfillsRequirement(const ID& c);
	
	friend bool operator== (const MajorRequirement &l, const MajorRequirement&r);
	friend bool operator!= (const MajorRequirement &l, const MajorRequirement &r);
	friend bool operator== (const MajorRequirement &l, const Requirement &r);
	friend bool operator!= (const MajorRequirement &l, const Requirement &r);
};

#endif
