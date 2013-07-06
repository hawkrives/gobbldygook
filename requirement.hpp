#ifndef __gobbldygook__requirement__
#define __gobbldygook__requirement__

#include "general.hpp"
#include "id.hpp"
using namespace std;

class Requirement {
protected: // todo make protected
	string name = "";
	int needed = 0;
	int has = 0;
	bool satisfied = false;

public:
	Requirement() : Requirement("", 0) {}
	Requirement(string str) : Requirement(str, 0) {}
	Requirement(string str, int n);

	void incrementHas();
	void decrementHas();

	string getName();
	int getNeeded();
	int getHas();
	bool getSatisfied();

	void setName(string str);
	void setNeeded(int n);

	friend bool operator== (const Requirement &l, const Requirement &r);
	friend bool operator!= (Requirement &l, Requirement &r);

	ostream& getData(ostream &os);
	void display();
};

ostream &operator<<(ostream &os, Requirement &item);

#endif /* defined(__gobbldygook__requirement__) */
