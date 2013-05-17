SHELL= /bin/sh
CC   = g++
CFLAGS = -Wall -g
ARCH := $(shell uname)
ifeq ($(ARCH), Linux)
else
CC = clang++
CLANG_WARNINGS_ON = -Wshadow
CLANG_WARNINGS_OFF = -Wno-header-hygiene -Wno-c++11-extensions -Wno-padded -Wno-global-constructors -Wno-exit-time-destructors -Wno-missing-prototypes -Wno-unused-parameter -Wno-sign-conversion -Wno-sign-compare -Wno-shorten-64-to-32 -Wno-non-virtual-dtor
CFLAGS = -g -Weverything $(CLANG_WARNINGS_ON) $(CLANG_WARNINGS_OFF)
endif

OBJECTS = general.o \
	concentration.o \
	course.o \
	department.o \
	id.o \
	major.o \
	majorRequirement.o \
	requirement.o \
	specialRequirement.o \
	student.o

# $@ takes the label of the rule
# $< takes the thing to the right of the label

main: test-data.o
	$(CC) $(CFLAGS) -o $@ $< $(OBJECTS)

## # # # # # # ##

test-data.o: $(OBJECTS) test-data.cpp
	$(CC) $(CFLAGS) -c test-data.cpp

## # # # # # # ##

%.o: %.cpp
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o main
