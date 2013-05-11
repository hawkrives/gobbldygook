#ifndef __Data_major__
#define __Data_major__

#include "data-general.hpp"
using namespace std;

class Major {
private:
	string name;
	int difficulty;
	vector<MajorRequirement> requirements;
};

#endif
