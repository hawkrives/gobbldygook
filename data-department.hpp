#ifndef __Data_department__
#define __Data_department__

#include "data-general.hpp"
using namespace std;

class Department {
private:
	dept_t id;
	dept_t intToDept(int i);
	dept_t stringToDept(string str);
	dept_t shortStringToDept(string str);
	string deptToString(dept_t dept);
	string deptToLongName(dept_t dept);
public:
	Department();
	Department(int i);
	Department(dept_t department);
	Department(string str);

	dept_t getID();
	string getName();
	string getFullName();

	ostream& getData(ostream &os);
};

#endif
