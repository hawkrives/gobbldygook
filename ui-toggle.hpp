#ifndef __ui_toggle__
#define __ui_toggle__

#include "ui-rect.hpp"
using namespace std;

class Toggle : public UIRect {
protected:
	bool shrunken;
public:
	Toggle();
	Toggle(double x, double y, double w, double h, string text);
	Toggle(double x, double y, double w, double h, string text, bool small);
	Toggle(const Toggle &c);
	Toggle &operator= (const Toggle &c);
	
	void draw();
	
	bool getStatus();
	void setStatus(bool status);
	void toggleStatus();
};

#endif
