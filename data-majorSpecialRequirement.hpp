#ifndef __Data_majorSpecialRequirement__
#define __Data_majorSpecialRequirement__

#include "data-general.hpp"
#include "data-majorRequirement.hpp"
using namespace std;

class MajorSpecialRequirement {
private:
	string name;
	int needed;
	int has;
	bool satisfied;
	vector<MajorRequirement> validSets;
public:
	bool fulfillsRequirement(const MajorRequirement& c);
	void incrementHas();
	
	friend bool operator== (const MajorSpecialRequirement &d1, const MajorSpecialRequirement &d2);
	friend bool operator!= (MajorSpecialRequirement &d1, MajorSpecialRequirement &d2);
};

#endif
