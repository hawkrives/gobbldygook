#ifndef __Gobbldygook__id__
#define __Gobbldygook__id__

#include "data-general.hpp"
#include "data-department.hpp"

class ID {
private:
	vector<Department> departments;
	int number;
	string section;
private:
	void init(Department d, int n, string s);
	void copy(const ID& c);
public:
	ID();
	ID(const ID& c);
	ID(string str);
	ID(string dn, string s);
	ID(string s1, string s2, string s3);
	ID(Department d, int n, string s);
	ID& operator= (const ID &c);
	
	Department getDepartment(int i);
	int getNumber();
	string getSection();
	
	friend bool operator== (ID &i1, ID &i2);
    friend bool operator!= (ID &i1, ID &i2);
	
	ostream& getData(ostream& os);
	void display();
};

ostream& operator<<(ostream& os, ID& item);

#endif
