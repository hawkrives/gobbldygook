#include "ui-toggle.hpp"

Toggle::Toggle(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {
	shrunken = false;
}
Toggle::Toggle(double x, double y, double w, double h, string text, bool small) : UIRect(x, y, w, h, text) {
	shrunken = small;
}
Toggle::Toggle(const Toggle &c) : UIRect(c) {
	shrunken = c.shrunken;
}

Toggle& Toggle::operator=(const Toggle &c) {
	if (this == &c) return *this;
	UIRect::copy(c);
	shrunken = c.shrunken;
	return *this;
}

bool Toggle::getStatus() {
	return active;
}
void Toggle::setStatus(bool status) {
	active = status;
}
void Toggle::toggleStatus() {
	if (active == true)
		active = false;
	else
		active = true;
}

void Toggle::draw() {
	UIRect::draw();
}