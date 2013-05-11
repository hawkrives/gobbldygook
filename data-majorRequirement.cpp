#include "data-majorRequirement.hpp"
using namespace std;

// bool MajorRequirement::fulfillsRequirement(const Course& c) {
// 	for (vector<Course>::iterator i=validCourses.begin(); i!=validCourses.end(); ++i) {
// 		if (*i==c)
// 			return true;
// 	}
// 	return false;
// }

void MajorRequirement::incrementHas() {
	++has;
}
