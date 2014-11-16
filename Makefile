gulp = node node_modules/.bin/gulp
uglifyjs = node node_modules/.bin/uglifyjs

all:
	@echo "You can run these commands via make:"
	@echo "make build:    Run the build process"
	@echo "make clean:    Clean the dist/ dir (by deleting it)"
	@echo "make cloc:     If you have cloc installed, will count lines of code"
	@echo "make dist:     Build, then uglify"
	@echo "make scripts:  Just builds the scripts"
	@echo "make sass:     Just builds the stylesheets"
	@echo "make test:     Prepares and runs the tests"
	@echo "make uglify:   uglify app.js -> app.min.js"


.PHONY: build clean cloc dist sass scripts serve test uglify watch

build:
	$(gulp) build

clean:
	$(gulp) clean

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

dist: build uglify

sass:
	$(gulp) sass
	# cssshrink

scripts:
	$(gulp) browserify

serve:
	$(gulp) watch

test:
	npm test

uglify:
	$(uglifyjs) dist/app.js --in-source-map dist/app.js.map --source-map dist/app.js.ug.map --screw-ie8 -c --stats -o dist/app.min.js

watch:
	$(gulp) watch
