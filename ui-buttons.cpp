#include "ui-buttons.hpp"

Button::Button(double x, double y, double w, double h, string text) : UIRect(x, y, w, h, text) {}
Button::Button(const Button &c) : UIRect(c) {}

Button& Button::operator=(const Button &c) {
	if (this == &c)
		return *this;
// 	return UIRect::hover(x, y);
// }

	UIRect::copy(c);
	return *this;
}

// bool Button::hover(double x, double y) {
// 	return UIRect::hover(x, y);
// }

void Button::draw() {
	UIRect::draw();

	glRasterPos2f(x1+5, y1+(y1+y2-15)/2);
	for (unsigned int i = 0; i < contents.length(); i++)
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, contents[i]);
}
