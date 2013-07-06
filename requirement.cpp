#include "requirement.hpp"

Requirement::Requirement(string str, int need) {
	name = str;
	needed = need;
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
