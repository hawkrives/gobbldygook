#include "ui-elements.h"

Label::Label(double newX, double newY, string text) {
	x = newX; y = newY;
	contents = text;
	active = false;
}

Label::Label(const Label &c) {
	x = c.x; y = c.y;
	contents = c.contents;
	active = c.active;
}

// Label::Label &operator=(const Label &c) {
// 	if (this == &c)
// 		return *this;

// 	delete &text;
// 	x = c.x;
// 	y = c.y;
// 	text = c.text;
// 	active = c.active;

// 	return *this;
// }  

void Label::draw() {
	glRasterPos2f( x, y );
	for (unsigned int i = 0; i < contents.length(); i++)
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, contents[i]);
}
