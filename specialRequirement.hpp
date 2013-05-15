#ifndef __Data_majorSpecialRequirement__
#define __Data_majorSpecialRequirement__

#include "general.hpp"
#include "requirement.hpp"
#include "majorRequirement.hpp"
using namespace std;

class MajorSpecialRequirement {
private:
	void init();
	void copy(const MajorSpecialRequirement &c);
	string name;
	int needed;
	int has;
	bool satisfied;
	vector<MajorRequirement> validSets;
public:
	MajorSpecialRequirement();
	MajorSpecialRequirement(istream &is);
	MajorSpecialRequirement(string fn);
	MajorSpecialRequirement(const MajorSpecialRequirement &c);
	MajorSpecialRequirement operator= (const MajorSpecialRequirement &c);
	bool fulfillsRequirement(const MajorRequirement& c);
	void incrementHas();
	
	friend bool operator== (const MajorSpecialRequirement &msr1, const MajorSpecialRequirement &msr2);
	friend bool operator!= (MajorSpecialRequirement &msr1, MajorSpecialRequirement &msr2);
};

#endif
