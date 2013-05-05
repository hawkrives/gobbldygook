#ifndef __TextBox__
#define __TextBox__

#include "ui-rect.hpp"
using namespace std;

class TextBox : public UIRect {
public:
	TextBox();
	TextBox(double x, double y, double w, double h);
	TextBox(double x, double y, double w, double h, string text);
	TextBox(const TextBox &c);

	TextBox &operator= (const TextBox &c);
};

class FilterBox : public TextBox {
public:
	FilterBox();
	FilterBox(double x, double y, double w, double h, string text);
	FilterBox(const FilterBox &c);
	
	FilterBox &operator= (const FilterBox &c);
	
//	void draw();
};

#endif