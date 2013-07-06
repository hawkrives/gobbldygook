#ifndef __Data_major__
#define __Data_major__

#include "general.hpp"
#include "majorRequirement.hpp"
#include "specialRequirement.hpp"
#include "department.hpp"

using namespace std;

class Major {
protected:
	void parse(vector<string> record);
protected:
	string name;
	Department department;
	vector<MajorRequirement *> requirements;
	vector<SpecialRequirement *> specialRequirements;
	vector<MajorRequirement *> setRequirements;

public:
	friend class Concentration;
	Major() : name("None"), department("NONE") {}
	Major(string str);

	ostream& getData(ostream &os);
	void display();

	vector<MajorRequirement *>* getMajorRequirements();
	vector<SpecialRequirement *>* getSpecialRequirements();
	vector<MajorRequirement *>* getSetRequirements();

	SpecialRequirement* getSpecialRequirement(string str);
	MajorRequirement* getMajorRequirement(string str);
	MajorRequirement* getSetRequirement(string str);

	friend bool operator== (const Major &l, const Major &r);
	friend bool operator!= (Major &l, Major &r);
};

ostream &operator<<(ostream &os, Major &item);

inline bool operator== (const Major &l, const Major &r) {
	bool name = (l.name == r.name);
	bool dept = (l.department == r.department);
	bool reqs = (l.requirements == r.requirements &&
				 l.specialRequirements == r.specialRequirements &&
				 l.setRequirements == r.setRequirements);
    return (name && dept && reqs);
}

inline bool operator!= (Major &l, Major &r) {
    return !(l == r);
}

#endif
