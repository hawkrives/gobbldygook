#ifndef __Data_major__
#define __Data_major__

#include "general.hpp"
#include "majorRequirement.hpp"
#include "specialRequirement.hpp"
#include "department.hpp"
using namespace std;

class Major {
private:
	string name;
	Department department;
	map<string, MajorRequirement> requirements;
	map<string, SpecialRequirement> specialRequirements;
	void copy(const Major &c);
public:
	Major();
	Major(string str);
	Major(const Major& c);
	Major& operator= (const Major &c);

	ostream& getData(ostream &os);
	void display();
	
	friend class Concentration;
};

ostream &operator<<(ostream &os, Major &item);

#endif
