#ifndef __Data_student__
#define __Data_student__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-course.hpp"
using namespace std;

class Student {
public:
	string name;
	vector<Course> takenCourses;
	vector<Major> majors;
	vector<Concentration> concentrations;
	vector<Conversation> conversations;
	vector<Instructor> favInstructors;

	string interests;
	double gradYear;

	ostream& getData(ostream &os) {
		os << name << " ";

		for (vector<Course>::iterator i = takenCourses.begin(); i != takenCourses.end(); ++i)
			os << i->getID() << " ";

		for (vector<Major>::iterator i = majors.begin(); i != majors.end(); ++i)
			os << i->name << " ";

		return os;
	}
	void display();
};

#endif
