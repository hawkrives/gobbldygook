#include "requirement.hpp"


Requirement::Requirement() {
	init("", 0);
}

Requirement::Requirement(string str) {
	init(str, 0);
}

Requirement::Requirement(string str, int n) {
	init(str, n);
}

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

void Requirement::decrementHas() {
	--has;
	if (has >= needed)
		satisfied = true;
	else
		satisfied = false;
}

string Requirement::getName() {
	return name;
}
int Requirement::getNeeded() {
	return needed;
}
int Requirement::getHas() {
	return has;
}
bool Requirement::getSatisfied() {
	return satisfied;
}
void Requirement::setName(string str) {
	name = str;
}
void Requirement::setNeeded(int n) {
	needed = n;
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

ostream& Requirement::getData(ostream &os) {
	if (satisfied)
		cout << "✅";
	else
		cout << "❌";
	os << "  ";
	os << name;
	os << " needs " << needed;
	if (satisfied)
		os << ", and has ";
	else
		os << ", but has ";
	os << has << ".";
	return os;
}

ostream &operator<<(ostream &os, Requirement &item) {
	return item.getData(os);
}

void Requirement::display() {
	cout << *this << endl;
}
