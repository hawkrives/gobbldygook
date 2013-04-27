OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
 MACOSX_DEFINE = -DMACOSX -I/sw/include
 LIBS = -I/usr/common/include -I/usr/include/GL -L/System/Library/Frameworks/OpenGL.framework/Libraries -framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++

endif

schedule: ui.o
	g++ $(OPTS) -o schedule ui.o $(LIBS)

ui.o: ui.cpp ui.h ui-buttons.cpp ui-label.cpp ui-textboxes.cpp
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui.cpp

rectangle.o: Rectangle.cpp Rectangle.h
	g++ $(OPTS) $(MACOSX_DEFINE) -c Rectangle.cpp

clean:
	rm -f *.o proto-game
