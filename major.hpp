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
	vector<MajorRequirement> requirements;
	vector<SpecialRequirement> specialRequirements;
	void copy(const Major &c);
public:
	Major();
	Major(string str);
	Major(const Major& c);
	Major& operator= (const Major &c);

	ostream& getData(ostream &os);
	void display();
	
	friend class Concentration;
	SpecialRequirement* getSpecialRequirement(vector<SpecialRequirement> reqs, string name);
	MajorRequirement* getMajorRequirement(vector<MajorRequirement> reqs, string name);
};

ostream &operator<<(ostream &os, Major &item);

#endif
