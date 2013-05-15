#ifndef __Gobbldygook__concentration__
#define __Gobbldygook__concentration__

#include "general.hpp"
#include "major.hpp"
using namespace std;

class Concentration : public Major {	
public:
	Concentration();
	Concentration(string str);
	Concentration(const Concentration& c);
	Concentration& operator= (const Concentration &c);
	
	ostream& getData(ostream &os);
	void display();
};

ostream &operator<<(ostream &os, Major &item);

#endif
