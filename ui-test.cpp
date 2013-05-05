#include "color.hpp"

#include "ui.hpp"

//#include "ui-buttons.hpp"
//#include "ui-label.hpp"
//#include "ui-textboxes.hpp"
//#include "ui-toggle.hpp"

//#include "glui/GL/glui.h"

using namespace std;

int WIDTH = 1280;  // width of the user window
int HEIGHT = 768;  // height of the user window
char programName[] = "scheduler";

// button info
//vector<Button> buttons;
//vector<Rectangle> boxes;
//vector<TextBox> textboxes;
//vector<Toggle> toggles;
//vector<Label> labels;

const unsigned int MAX_NUM_CHARS_IN_TEXTBOX = 20;

void drawWindow() {
	glClear(GL_COLOR_BUFFER_BIT); // clear the buffer
	
//	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i)      i->draw();
//	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) i->draw();
//	for (vector<Rectangle>::iterator i = boxes.begin(); i != boxes.end(); ++i)       i->draw();
//	for (vector<Label>::iterator i = labels.begin(); i != labels.end(); ++i)         i->draw();
	
	glutSwapBuffers(); // tell the graphics card that we're done.
}

// close the window and finish the program
void exitAll() {
	int win = glutGetWindow();
	glutDestroyWindow(win);
	exit(0);
}

// the reshape function handles the case where the user changes the size of the window.  We need to fix the coordinate system, so that the drawing area is still the unit square.
void reshape(int w, int h) {
	glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	WIDTH = w;  HEIGHT = h;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
}

// initGlWindow is the function that starts the ball rolling, in  terms of getting everything set up and passing control over to the glut library for event handling. It needs to tell the glut library about all the essential functions: what function to call if the window changes shape, what to do to redraw, handle the keyboard, etc.

int main() {
	char *argv[] = { programName };
	int argc = sizeof(argv) / sizeof(argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode( GLUT_RGBA | GLUT_DOUBLE );
	glutInitWindowSize(WIDTH,HEIGHT);
	glutInitWindowPosition(100,100);
	glutCreateWindow(programName);

	// clear the window to black
	glClearColor(0.0, 0.0, 0.0, 1.0);
	glClear(GL_COLOR_BUFFER_BIT);
	
	// set up the coordinate system:  number of pixels along x and y
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
	
	// welcome message
	cout << "Welcome to " << programName << endl;
	
	glutDisplayFunc(drawWindow);
	glutReshapeFunc(reshape);
	glutMainLoop();
}

