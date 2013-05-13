#include "data-concentration.hpp"
using namespace std;

Concentration::Concentration() : Major() {
	cout << "Called Concentration constructor with nothing." << endl;
}

Concentration::Concentration(string str) : Major(str) {
	// cout << "Called Concentration constructor with string '" << str << "'" << endl;
}

Concentration::Concentration(const Concentration &c) : Major(c) {}

Concentration& Concentration::operator= (const Concentration &c) {
	if (this == &c) return *this;
	Major::copy(c);
	return *this;
}

ostream& Concentration::getData(ostream &os) {
	os << name;
	return os;
}

ostream &operator<<(ostream &os, Concentration &item) {
	return item.getData(os);
}

void Concentration::display() {
	cout << *this << endl;
}
