OPTS = -Wall -g
LIBS = -lGL -lglut -lm
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
 MACOSX_DEFINE = -DMACOSX -I/sw/include
 LIBS = -I/usr/common/include -I/usr/include/GL -L/System/Library/Frameworks/OpenGL.framework/Libraries -framework GLUT -framework OpenGL -lGL -lm -lobjc -lstdc++

endif

schedule: proto-game.o
	g++ $(OPTS) -o proto-game proto-game.o $(LIBS)

proto-game.o: proto-game.cpp
	g++ $(OPTS) $(MACOSX_DEFINE) -c proto-game.cpp

clean:
	rm -f *.o proto-game
