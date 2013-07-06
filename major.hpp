#ifndef __Data_major__
#define __Data_major__

#include "general.hpp"
#include "majorRequirement.hpp"
#include "specialRequirement.hpp"
#include "department.hpp"
using namespace std;

class Major {
public: //todo make private
protected:
	void parse(vector<string> record);
	string name;
	Department department;
	void copy(const Major &c);
	vector<MajorRequirement *> requirements;
	vector<SpecialRequirement *> specialRequirements;
	vector<MajorRequirement *> setRequirements;
public:
	Major();
	Major(string str);
	Major(const Major& c);
	Major& operator= (const Major &c);

	ostream& getData(ostream &os);
	void display();
	
	friend class Concentration;
	SpecialRequirement* getSpecialRequirement(string str);
	MajorRequirement* getMajorRequirement(string str);
	MajorRequirement* getSetRequirement(string str);
};

ostream &operator<<(ostream &os, Major &item);

#endif
