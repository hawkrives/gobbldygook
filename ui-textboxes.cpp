#include "ui-elements.h"

TextBox::TextBox() {
	UIRect::init(5, 5, 50, 20, "");
	setBorderWidth(2);
}

TextBox::TextBox(double x, double y, double w, double h, string text) {
	UIRect::init(x, y, w, h, text);
}
TextBox::TextBox(const TextBox &c) {
	UIRect::copy(c);
}

TextBox& TextBox::operator=(const TextBox &c) {
	if (this == &c)
		return *this;

	UIRect::copy(c);

	return *this;
}

// bool Button::hover(int x, int y) {
// 	return UIRect::hover(x, y);
// }

void TextBox::draw() {
	UIRect::draw();

	glRasterPos2f(x1+5, y1+(y1+y2-15)/2);
	for (unsigned int i = 0; i < contents.length(); i++)
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, contents[i]);
}
