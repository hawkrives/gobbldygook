#include "gened.hpp"

bool GenEd::checkSatisfied() {
	if (has >= needed)
		satisfied = true;
	else
		satisfied = false;
	return satisfied;
}

void GenEd::incrementHas() {
	++has;
	checkSatisfied();
}

void GenEd::decrementHas() {
	--has;
	checkSatisfied();
}

string GenEd::getName() {
	return name;
}

int GenEd::getNeeded() {
	return needed;
}

int GenEd::getHas() {
	return has;
}

bool GenEd::getSatisfied() {
	return checkSatisfied();
}

void GenEd::setName(string str) {
	name = str;
}

void GenEd::setNeeded(int n) {
	needed = n;
}

ostream& GenEd::getData(ostream &os) {
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

ostream &operator<<(ostream &os, GenEd &item) {
	return item.getData(os);
}

void GenEd::display() {
	cout << *this << endl;
}
