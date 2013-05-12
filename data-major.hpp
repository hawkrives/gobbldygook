#ifndef __Data_major__
#define __Data_major__

#include "data-general.hpp"
#include "data-majorRequirement.hpp"
#include "data-department.hpp"
using namespace std;

class Major {
private:
	string name;
	Department department;
	vector<MajorRequirement> requirements;
	void copy(const Major &c);
public:
	Major();
	Major(string str);
	Major(const Major& c);
	Major& operator= (const Major &c);

	ostream& getData(ostream &os);
	void display();
};

ostream &operator<<(ostream &os, Major &item);

#endif
