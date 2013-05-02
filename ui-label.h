#ifndef __Label__
#define __Label__

using namespace std;
#include "ui.h"

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

#endif