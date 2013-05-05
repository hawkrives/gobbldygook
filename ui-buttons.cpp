#include "ui-buttons.hpp"

Button::Button(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {}
Button::Button(const Button &c) : UIRect(c) {}

Button& Button::operator=(const Button &c) {
	if (this == &c)
		return *this;

	UIRect::copy(c);
	return *this;
}
