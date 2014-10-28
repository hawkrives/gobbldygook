gulp = node node_modules/.bin/gulp

all: serve

.PHONY: build clean scripts scripts-nowatch styles serve test cloc

build:
	$(gulp) default

dist:
	$(gulp) build-dist

scripts:
	$(gulp) scripts

styles:
	$(gulp) styles
	# cssshrink

serve:
	$(gulp) serve

test:
	./prepare-test.sh
	npm test

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

clean:
	$(gulp) clean
