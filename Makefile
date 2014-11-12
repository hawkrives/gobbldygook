gulp = node node_modules/.bin/gulp
uglifyjs = node node_modules/.bin/uglifyjs

all:
	echo "make build"
	echo "make clean"
	echo "make cloc"
	echo "make dist"
	echo "make scripts"
	echo "make styles"
	echo "make test"
	echo "make uglify"


.PHONY: build clean cloc dist scripts serve styles test uglify

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

uglify:
	$(uglifyjs) dist/app.js --in-source-map dist/app.js.map --source-map dist/app.js.ug.map --screw-ie8 -c --stats -o dist/app.min.js
