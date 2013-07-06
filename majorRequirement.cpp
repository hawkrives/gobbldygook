#include "majorRequirement.hpp"

bool MajorRequirement::fulfillsRequirement(const ID& c) const {
	for (auto i : validCourses)
		if (i == c)
			return true;

	return false;
}

void MajorRequirement::addCourse(const ID& c) {
	validCourses.push_back(c);
}

ostream &operator<<(ostream &os, MajorRequirement &item) {
	return item.getData(os);
}
