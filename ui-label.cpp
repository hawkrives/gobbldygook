#include "ui-elements.h"

Label::Label() {
	x = 0; y = 0;
	contents = "";
	active = false;
	color = Color(0);
}

Label::Label(double newX, double newY, string text) {
	x = newX; y = newY;
	contents = text;
	active = false;
	color = Color(0);
}

Label::Label(double newX, double newY, string text, Color c) {
	x = newX; y = newY;
	contents = text;
	active = false;
	color = c;
}


Label::Label(const Label &c) {
	x = c.x; 
	y = c.y;
	contents = c.contents;
	active = c.active;
	color = c.color;
}

Label &Label::operator=(const Label &c) {
	if (this == &c)
		return *this;

	x = c.x;
	y = c.y;
	contents = c.contents;
	active = c.active;
	color = c.color;

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
