#ifndef __gobbldygook__gened__
#define __gobbldygook__gened__

#include "general.hpp"
#include "id.hpp"
using namespace std;

class GenEd {
protected:
	string name = "";
	int needed = 0;
	int has = 0;
	bool satisfied = false;

	bool checkSatisfied();

public:
	GenEd() : GenEd("", 0) {}
	GenEd(string str) : GenEd(str, 0) {}
	GenEd(string str, int n) : name(str), needed(n) {}

//	bool fulfillsRequirement(const ID& c);
//	void addCourse(const ID& c);

	void incrementHas();
	void decrementHas();

	string getName();
	int getNeeded();
	int getHas();
	bool getSatisfied();

	void setName(string str);
	void setNeeded(int n);

	friend bool operator== (const GenEd &l, const GenEd &r);
	friend bool operator!= (const GenEd &l, const GenEd &r);

	ostream& getData(ostream &os);
	void display();
};

ostream &operator<<(ostream &os, GenEd &item);

inline bool operator== (const GenEd &l, const GenEd &r) {
	bool name = (l.name == r.name);
	bool needed = (l.needed == r.needed);
	bool has = (l.has == r.has);
	bool satisfied = (l.satisfied == r.satisfied);
    return (name && needed && has && satisfied);
}

inline bool operator!= (GenEd &l, GenEd &r) {
    return !(l == r);
}

#endif /* defined(__gobbldygook__gened__) */
