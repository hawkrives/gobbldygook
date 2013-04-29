#ifndef __uielements__
#define __uielements__
#ifdef MACOSX
#include <GLUT/glut.h>
#else
#include <GL/glut.h>
#endif
#include <string.h>
#include <sstream>
#include <vector>
#include "Rectangle.h"
using namespace std;

class Label {
protected:
	double x, y;
	double width, height;
	Color color;
public:
	Label();
	Label(double newX, double newY, string text);
	Label(double newX, double newY, string text, Color c);
	Label(const Label &c);
	Label &operator= (const Label &c);

	string contents;
	bool active;

	void setColor(Color c);

	void draw();
};

class UIRect {
private:
	void createBorder(double size, Color color);
protected:
	double x1, y1, x2, y2;
	double width, height;
	double borderThickness;

	Color backgroundColor, borderColor;
	Rectangle background, border;
public:
	UIRect();
	UIRect(double x, double y, double w, double h, string text);
	UIRect(const UIRect &c);
	UIRect& operator = (const UIRect &c);

	Label label;
	bool active;

	void init(double x, double y, double w, double h, string text);
	void copy(const UIRect &c);

	string getLabel();
	void setLabel(string text);

	void setX1(double x);
	void setX2(double x);
	void setY1(double y);
	void setY2(double y);

	void setWidth(double w);
	void setHeight(double h);

	void setBorderWidth(double w);
	void setBorderColor(Color c);
	void setBackgroundColor(Color c);

	bool hover(int x, int y);
	virtual void draw();
};

class Button : public UIRect {
public:
	Button();
	Button(double x, double y, double w, double h, string text);
	Button(const Button &c);

	Button& operator= (const Button &c);

	void draw();
};

class TextBox : public UIRect {
public:
	TextBox();
	TextBox(double x, double y, double w, double h, string text);
	TextBox(const TextBox &c);

	TextBox &operator= (const TextBox &c);

	void draw();
};

#endif