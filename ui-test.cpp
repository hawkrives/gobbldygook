#include "color.hpp"

#include "ui.hpp"
#include "ui-buttons.hpp"
#include "ui-label.hpp"
#include "ui-textboxes.hpp"
#include "ui-toggle.hpp"

using namespace std;

int WIDTH = 1280;  // width of the user window
int HEIGHT = 768;  // height of the user window
char programName[] = "scheduler";

// button info
vector<Button> buttons;
vector<TextBox> textboxes;
vector<Toggle> toggles;
vector<Label> labels;

const unsigned int MAX_NUM_CHARS_IN_TEXTBOX = 20;

void drawWindow() {
	glClear(GL_COLOR_BUFFER_BIT); // clear the buffer
	
	for (vector<Button>::iterator i = buttons.begin(); i != buttons.end(); ++i)
		i->draw();
	for (vector<TextBox>::iterator i = textboxes.begin(); i != textboxes.end(); ++i) 
		i->draw();
	for (vector<Label>::iterator i = labels.begin(); i != labels.end(); ++i)
		i->draw();
	for (vector<Toggle>::iterator i = toggles.begin(); i != toggles.end(); ++i)
		i->draw();
	
	glutSwapBuffers();
}

void reshape(int w, int h) {
	glViewport(0, 0, (GLsizei) w, (GLsizei) h);
	WIDTH = w;  HEIGHT = h;
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(0., WIDTH-1, HEIGHT-1, 0., -1.0, 1.0);
}

int main() {
	char *argv[] = { programName };
	int argc = sizeof(argv) / sizeof(argv[0]);
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE);
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
	buttons.push_back(Button(10, 10, 100, 40, "Hi"));

	
	glutDisplayFunc(drawWindow);
	glutReshapeFunc(reshape);
	glutMainLoop();
}

