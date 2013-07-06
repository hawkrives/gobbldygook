#ifndef __Gobbldygook__concentration__
#define __Gobbldygook__concentration__

#include "general.hpp"
#include "major.hpp"
using namespace std;

class Concentration : public Major {	
public:
	Concentration() : Major() {}
	Concentration(string s);
	
	ostream& getData(ostream &os);
	void display();

	friend bool operator== (const Concentration &l, const Concentration &r);
	friend bool operator!= (Concentration &l, Concentration &r);
};

ostream &operator<<(ostream &os, Major &item);

inline bool operator== (const Concentration &l, const Concentration &r) {
    return (l == r);
}

inline bool operator!= (Concentration &l, Concentration &r) {
    return !(l == r);
}

#endif // defined __Gobbldygook__concentration__
