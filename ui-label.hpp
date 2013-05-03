#ifndef __Label__
#define __Label__

#include "ui.hpp"

using namespace std;

class Label {
public:
	void init(double newX, double newY, string text, Color c);
	void copy(const Label &c);
	
	Label();
	Label(double newX, double newY, string text);
	Label(double newX, double newY, string text, Color c);
	Label(const Label &c);
	Label &operator= (const Label &c);

	string contents;
	bool active;
	double x, y;
	double width, height;
	Color color;

	void setColor(Color c);

	void draw();
};

class Heading : public Label {
public:
	Heading();
	Heading(double newX, double newY, string text);
	Heading(double newX, double newY, string text, Color c);
	Heading(const Heading &c);
	Heading &operator= (const Heading &c);
};

class CollapsibleHeading : public Heading {
protected:
	bool collapsed;
public:
	CollapsibleHeading();
	CollapsibleHeading(double newX, double newY, string text);
	CollapsibleHeading(double newX, double newY, string text, Color c);
	CollapsibleHeading(const CollapsibleHeading &c);
	CollapsibleHeading &operator= (const CollapsibleHeading &c);
};

class CourseID : public Label {
public:
	CourseID();
	CourseID(double newX, double newY, string text);
	CourseID(double newX, double newY, string text, Color c);
	CourseID(const CourseID &c);
	CourseID &operator= (const CourseID &c);
};

class CourseName : public Label {
public:
	CourseName();
	CourseName(double newX, double newY, string text);
	CourseName(double newX, double newY, string text, Color c);
	CourseName(const CourseName &c);
	CourseName &operator= (const CourseName &c);
};

#endif