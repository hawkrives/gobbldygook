#ifndef __TextBox__
#define __TextBox__

using namespace std;
#include "ui-rect.h"

class TextBox : public UIRect {
public:
	TextBox();
	TextBox(double x, double y, double w, double h, string text);
	TextBox(const TextBox &c);

	TextBox &operator= (const TextBox &c);

	void draw();
};

#endif