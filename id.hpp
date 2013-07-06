#ifndef __Gobbldygook__id__
#define __Gobbldygook__id__

#include "general.hpp"
#include "department.hpp"

class ID {
protected:
	vector<Department> departments;
	int number;
	string section;

protected:
	void initiate(Department d, int n, string s);

public:
	ID();
	ID(string str);
	ID(string dn, string s) : ID(dn + s) {}
	ID(string d, string n, string s) : ID(d + n + s) {}
	ID(Department d, int n, string s);
	ID& operator= (const ID &c);
	
	Department getDepartment(int i);
	const Department getDepartment_const(int i);
	int getNumber();
	string getSection();
	
	friend bool operator== (const ID &i1, const ID &i2);
    friend bool operator!= (ID &i1, ID &i2);
	friend bool operator<  (const ID &i1, const ID &i2);
	
	ostream& getData(ostream& os);
	void display();
};

ostream& operator<<(ostream& os, ID& item);

inline bool operator== (const ID &i1, const ID &i2) {
	bool dept = (i1.departments.at(0) == i2.departments.at(0));
	bool num = (i1.number == i2.number);
	bool sec = (i1.section == i2.section);
    return (dept && num && sec);
}

inline bool operator!= (ID &i1, ID &i2) {
    return !(i1 == i2);
}

inline bool operator< (const ID &i1, const ID &i2) {
	bool dept = (i1.departments.at(0) < i2.departments.at(0));
	bool num = (i1.number < i2.number);
	bool sec = (i1.section < i2.section);
	return (dept && num && sec);
}

#endif
