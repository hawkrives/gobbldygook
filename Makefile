SHELL= /bin/sh
CC   = g++
CFLAGS = -Wall -g
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
MACOSX_DEFINE = -DMACOSX -I/sw/include
LIBS = -I/usr/common/include
endif

OBJECTS = data-general.o \
	data-course.o \
	data-department.o \
	data-major.o \
	data-majorRequirement.o \
	data-student.o

# $@ takes the label of the rule
# $< takes the thing to the right of the label

data-test: data-test.o
	$(CC) $(CFLAGS) -o $@ $< $(OBJECTS) $(LIBS)

## # # # # # # ##

data-test.o: $(OBJECTS)
	$(CC) $(CFLAGS) $(MACOSX_DEFINE) $(LIBS) -c data-test.cpp

## # # # # # # ##

%.o: %.cpp
	$(CC) $(CFLAGS) $(MACOSX_DEFINE) $(LIBS) -c $<

clean:
	rm -f *.o schedule
