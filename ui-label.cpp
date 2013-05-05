#include "ui-label.hpp"

/*
 * Label
 *
 */

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
	glRasterPos2f(x, y);
	for (unsigned int i = 0; i < contents.length(); i++)
		glutBitmapCharacter(GLUT_BITMAP_9_BY_15, contents[i]);
	glEnd();
}

/* 
 * Heading
 *
 */

Heading::Heading(double newX, double newY, string text) : Label(newX, newY, text) {};
Heading::Heading(double newX, double newY, string text, Color color) : Label(newX, newY, text, color) {};
Heading::Heading(const Heading &c) : Label(c) {};
Heading &Heading::operator=(const Heading &c) {
	if (this == &c) return *this;
	Label::copy(c);
	return *this;
}

/*
 * CollapsibleHeading
 *
 */

CollapsibleHeading::CollapsibleHeading(double newX, double newY, string text) : Heading(newX, newY, text) {};
CollapsibleHeading::CollapsibleHeading(double newX, double newY, string text, Color color) : Heading(newX, newY, text, color) {};
CollapsibleHeading::CollapsibleHeading(const CollapsibleHeading &c) : Heading(c) {
	collapsed = c.collapsed;
};
CollapsibleHeading &CollapsibleHeading::operator=(const CollapsibleHeading &c) {
	if (this == &c) return *this;
	Label::copy(c);
	collapsed = c.collapsed;
	return *this;
}

/*
 * CourseID
 *
 */

CourseID::CourseID(double newX, double newY, string text) : Label(newX, newY, text) {};
CourseID::CourseID(double newX, double newY, string text, Color color) : Label(newX, newY, text, color) {};
CourseID::CourseID(const CourseID &c) : Label(c) {};
CourseID &CourseID::operator=(const CourseID &c) {
	if (this == &c) return *this;
	Label::copy(c);
	return *this;
}

/*
 * CourseName
 *
 */

CourseName::CourseName(double newX, double newY, string text) : Label(newX, newY, text) {};
CourseName::CourseName(double newX, double newY, string text, Color color) : Label(newX, newY, text, color) {};
CourseName::CourseName(const CourseName &c) : Label(c) {};
CourseName &CourseName::operator=(const CourseName &c) {
	if (this == &c) return *this;
	Label::copy(c);
	return *this;
}