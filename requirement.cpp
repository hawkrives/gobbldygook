#include "requirement.hpp"

Requirement::Requirement() {}

Requirement::Requirement(const Requirement &c) {
	copy(c);
}

Requirement Requirement::operator= (const Requirement &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

void Requirement::init(string n, int need) {
	name = n;
	needed = need;
	has = 0;
	satisfied = false;
}

void Requirement::copy(const Requirement &c) {
	name = c.name;
	needed = c.needed;
	has = c.has;
	satisfied = c.satisfied;
}

void Requirement::incrementHas() {
	++has;
	if (has >= needed)
		satisfied = true;
	else
		satisfied = false;
}

string Requirement::getName() {
	return name;
}

bool operator== (const Requirement &l, const Requirement &r) {
	bool name = (l.name == r.name);
	bool needed = (l.needed == r.needed);
	bool has = (l.has == r.has);
	bool satisfied = (l.satisfied == r.satisfied);
    return (name && needed && has && satisfied);
}

bool operator!= (Requirement &l, Requirement &r) {
    return !(l == r);
}
