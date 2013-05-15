#ifndef __Data_majorSpecialRequirement__
#define __Data_majorSpecialRequirement__

#include "general.hpp"
#include "requirement.hpp"
#include "majorRequirement.hpp"
using namespace std;

class SpecialRequirement : public Requirement {
private:
	void init();
	void copy(const SpecialRequirement &c);
	vector<MajorRequirement> validSets;
public:
	SpecialRequirement();
	SpecialRequirement(string str);
	SpecialRequirement(const SpecialRequirement &c);
	SpecialRequirement operator= (const SpecialRequirement &c);
	bool fulfillsRequirement(const MajorRequirement& c);
	
	friend bool operator== (const SpecialRequirement &l, const SpecialRequirement &r);
	friend bool operator!= (const SpecialRequirement &l, const SpecialRequirement &r);
	friend bool operator== (const SpecialRequirement &l, const Requirement &r);
	friend bool operator!= (const SpecialRequirement &l, const Requirement &r);
	
	friend class Major;
};

#endif
