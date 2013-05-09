#ifndef __Data_student__
#define __Data_student__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-course.hpp"
using namespace std;

struct Semester {
	int year, period;
	vector<Course> courses;
};

class Student {
public:
	string name;
	vector<Major> majors;

	vector<Semester> year1;//(3);
	vector<Semester> year2;//(3);
	vector<Semester> year3;//(3);
	vector<Semester> year4;//(3);

	int startingYear, gradutationYear;

	ostream& getData(ostream &os) {
		os << name << " ";

		return os;
	}
	void display();
};

#endif
