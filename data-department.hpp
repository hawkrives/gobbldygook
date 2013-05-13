#ifndef __Data_department__
#define __Data_department__

#include "data-general.hpp"
using namespace std;

class Department {
private: // constructory things
	void copy(const Department &c);
private: // variables
	dept_t id;

protected: // methods
	dept_t intToDept(int i);
	dept_t stringToDept(string str);
	dept_t shortStringToDept(string str);
	dept_t longStringToDept(string str);
	string deptToString(dept_t dept);
	string deptToLongName(dept_t dept);

public: // constructors
	Department();
	Department(int i);
	Department(dept_t department);
	Department(string str);
	Department(const Department& c);
	Department& operator= (const Department &c);
	
	friend bool operator== (Department &c1, Department &c2);
	friend bool operator!= (Department &c1, Department &c2);

	dept_t getID();
	string getName();
	string getFullName();
	ostream& getData(ostream &os);
};

#endif
