#ifndef __Data_majorRequirement__
#define __Data_majorRequirement__

#include "data-general.hpp"
using namespace std;

class MajorRequirement {
private:
  int needed;
  int has;
  bool satisfied;
  vector<Course> validCourses;
public:
  bool fulfillsRequirement(const Course& c) {
    for (vector<Course>::iterator i=validCourses.begin(); i!=validCourses.end(); ++i) {
      if (*i==c)
	return true;
    }
    return false;
  }

  void incrementHas() {
    ++has;
  }
}
