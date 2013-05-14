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
};

#endif
