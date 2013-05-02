#ifndef __Button__
#define __Button__

using namespace std;
#include "ui-rect.h"

class Button : public UIRect {
public:
	Button();
	Button(double x, double y, double w, double h, string text);
	Button(const Button &c);

	Button& operator= (const Button &c);

	void draw();
};

#endif