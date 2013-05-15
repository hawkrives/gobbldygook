#ifndef __gobbldygook__requirement__
#define __gobbldygook__requirement__

#include "general.hpp"
#include "id.hpp"
using namespace std;

class Requirement {
private:
	void init(string n, int need);
	void copy(const Requirement &c);
	string name;
	int needed;
	int has;
	bool satisfied;
public:
	Requirement();
	Requirement(istream &is);
	Requirement(string fn);
	Requirement(const Requirement &c);
	Requirement operator= (const Requirement &c);
	
	void incrementHas();

	friend bool operator== (const Requirement &l, const Requirement &r);
	friend bool operator!= (Requirement &l, Requirement &r);
};

#endif /* defined(__gobbldygook__requirement__) */
