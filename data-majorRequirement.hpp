#ifndef __Data_majorRequirement__
#define __Data_majorRequirement__

#include "data-general.hpp"
// #include "data-course.hpp"
using namespace std;

class MajorRequirement {
private:
	// int needed;
	int has;
	// bool satisfied;
	// vector<Course> validCourses;
public:
	// bool fulfillsRequirement(const Course& c);
	void incrementHas();
};

#endif
