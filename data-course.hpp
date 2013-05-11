#ifndef __Data_course__
#define __Data_course__

#include "data-general.hpp"
#include "data-major.hpp"
#include "data-department.hpp"

using namespace std;

class Course {
private:
	void init(string dept, int num);
	void copy(const Course& c);
protected:
	string id;
	int number;
	string title;
	string description;
	char section;
	
	vector<Major> majors;
	vector<Department> department;
	string concentrations;
	string conversations;
	string professor;

	int half_semester;
	bool pass_fail;
	float credits;
	string location;

	bool lab;
	GenEd* geneds;

	bool days[7];
	float time[7];
public:
	Course();
	Course(string str);
	Course(const Course& c);
	Course& operator = (const Course &c);
	Course(istream &is);

	void cleanTitle();

	void parseID(string str);
	void updateID();
	string getID();

	ostream& getData(ostream &os);
	void display();
	void showAll();
};

ostream &operator<<(ostream &os, Course &item);
extern vector<Course> all_courses;

ostream& operator<<(ostream& os, Course& item);
Course getCourse(string id);

#endif
