gulp = node node_modules/.bin/gulp
webpack = node node_modules/.bin/webpack

all:
	echo "make build"
	echo "make clean"
	echo "make cloc"
	echo "make dist"
	echo "make scripts"
	echo "make styles"
	echo "make test"
	echo "make webpack"

.PHONY: build clean cloc dist scripts serve styles test webpack

build:
	$(gulp) default

clean:
	$(gulp) clean

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

dist:
	$(gulp) build-dist

scripts:
	$(gulp) scripts

serve:
	$(gulp) serve

styles:
	$(gulp) styles
	# cssshrink

test:
	./prepare-test.sh
	npm test

webpack:
	$(webpack) --config webpack-config.js -d --progress
