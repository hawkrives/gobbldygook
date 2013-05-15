#ifndef __Data_majorRequirement__
#define __Data_majorRequirement__

#include "data-general.hpp"
#include "data-id.hpp"
using namespace std;

class MajorRequirement {
private:
  string name;
	int needed;
	int has;
	bool satisfied;
	vector<ID> validCourses;
public:
	bool fulfillsRequirement(const ID& c);
	void incrementHas();
};

#endif
