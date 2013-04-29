OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
 MACOSX_DEFINE = -DMACOSX -I/sw/include
 LIBS = -I/usr/common/include -I/usr/include/GL -L/System/Library/Frameworks/OpenGL.framework/Libraries -framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++

endif

schedule: ui elements Rectangle.h Color.h
	g++ $(OPTS) -o schedule ui.o ui-elements.o Color.o Rectangle.o $(LIBS)


ui: ui.cpp ui.h elements
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui.cpp

# data: data.cpp data.h
# 	g++ $(OPTS) $(MACOSX_DEFINE) -c data.cpp


elements: ui-elements.cpp ui-elements.h rectangle ui-label.cpp ui-textboxes.cpp ui-buttons.cpp
	g++ $(OPTS) $(MACOSX_DEFINE) -c ui-elements.cpp ui-elements.h ui-label.cpp ui-textboxes.cpp ui-buttons.cpp


rectangle: Rectangle.cpp Rectangle.h Color.h
	g++ $(OPTS) $(MACOSX_DEFINE) -c Rectangle.cpp

color: Color.cpp Color.h
	g++ $(OPTS) $(MACOSX_DEFINE) -c Color.cpp

clean:
	rm -f *.o schedule
