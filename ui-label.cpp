#include "ui-label.h"

void Label::init(double newX, double newY, string text, Color c) {
	x = newX; y = newY;
	contents = text;
	active = false;
	color = c;
}

void Label::copy(const Label &c) {
	init(c.x, c.y, c.contents, c.color);
	active = c.active;
}

Label::Label() {
	init(0, 0, "", Color(1.));
}

Label::Label(double newX, double newY, string text) {
	init(newX, newY, text, Color(1.));
}

Label::Label(double newX, double newY, string text, Color c) {
	init(newX, newY, text, c);
}

Label::Label(const Label &c) {
	copy(c);
}

Label &Label::operator=(const Label &c) {
	if (this == &c) return *this;
	copy(c);
	return *this;
}

void Label::setColor(Color c) {
	color = c;
}

void Label::draw() {
	glColor3f(color.red, color.green, color.blue);
	glRasterPos2f( x, y );
	for (unsigned int i = 0; i < contents.length(); i++)
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, contents[i]);
	glEnd();
}
