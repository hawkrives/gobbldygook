#ifndef __Data_course__
#define __Data_course__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-department.hpp"
using namespace std;

class Course {
private: // variables
	string id;
	int number;
	string title;
	string description;
	string section;
	
	vector<Major> majors;
	vector<Department> department;
	string concentrations;
	string conversations;
	string professor;
	
	int half_semester;
	bool pass_fail;
	float credits;
	string location;
	
	course_type_t courseType;
	GenEd* geneds;
	
	bool days[7];
	float time[7];
private: // methods
	void init(string identifier);
	void copy(const Course& c);
public:
	Course();
	Course(string str);
	Course(const Course& c);
	Course& operator= (const Course &c);
	Course(istream &is);

	friend bool operator== (Course &c1, Course &c2);
    friend bool operator!= (Course &c1, Course &c2);

	string cleanTitle(string title);

	void parseID(string str);
	void updateID();

	string getProfessor();
	string getID();
	string getType();

	ostream& getData(ostream& os);
	void display();
	void displayMany();
	void showAll();
};

extern vector<Course> all_courses;

ostream& operator<<(ostream& os, Course& item);
Course getCourse(string identifier);

#endif
