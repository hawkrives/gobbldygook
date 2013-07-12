#ifndef __Data_majorSpecialRequirement__
#define __Data_majorSpecialRequirement__

#include "general.hpp"
#include "requirement.hpp"
#include "majorRequirement.hpp"
using namespace std;

class SpecialRequirement : public Requirement {
protected:
	vector<MajorRequirement> validSets;

public:
	SpecialRequirement() : SpecialRequirement("", 0) {}
	SpecialRequirement(string str) : SpecialRequirement(str, 0) {}
	SpecialRequirement(string str, int n) : Requirement(str, n) {}

	bool fulfillsRequirement(const MajorRequirement& c);

	void addSet(MajorRequirement mr);
	vector<MajorRequirement>* getValidSets();

	friend bool operator== (const SpecialRequirement &l, const SpecialRequirement &r);
	friend bool operator!= (const SpecialRequirement &l, const SpecialRequirement &r);
	friend bool operator== (const SpecialRequirement &l, const Requirement &r);
	friend bool operator!= (const SpecialRequirement &l, const Requirement &r);

	friend class Major;
};

ostream &operator<<(ostream &os, SpecialRequirement &item);

#endif
