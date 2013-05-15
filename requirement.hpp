#ifndef __gobbldygook__requirement__
#define __gobbldygook__requirement__

#include "general.hpp"
#include "id.hpp"
using namespace std;

class Requirement {
<<<<<<< HEAD
private:
	void init(string n, int need);
	void copy(const Requirement &c);
=======
protected:
>>>>>>> master
	string name;
	int needed;
	int has;
	bool satisfied;
public:
<<<<<<< HEAD
	Requirement();
	Requirement(istream &is);
	Requirement(string fn);
	Requirement(const Requirement &c);
	Requirement operator= (const Requirement &c);
	
	void incrementHas();

	friend bool operator== (const Requirement &l, const Requirement &r);
	friend bool operator!= (Requirement &l, Requirement &r);
};

=======
	void init(string n, int need);
	void copy(const Requirement &c);
	Requirement();
	Requirement(string str);
	Requirement(string str, int n);
	Requirement(const Requirement &c);
	Requirement operator= (const Requirement &c);
	Requirement& operator++();
    Requirement& operator--();
	
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
	
	virtual ostream& getData(ostream &os);
	virtual void display();
};

ostream &operator<<(ostream &os, Requirement &item);

>>>>>>> master
#endif /* defined(__gobbldygook__requirement__) */
