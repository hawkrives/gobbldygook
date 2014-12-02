gulp = node node_modules/.bin/gulp
uglifyjs = node node_modules/.bin/uglifyjs

all:
	@echo "You can run these commands via make:"
	@echo "make build:    Run the build process"
	@echo "make clean:    Clean the dist/ dir (by deleting it)"
	@echo "make cloc:     If you have cloc installed, will count lines of code"
	@echo "make dist:     Build, then uglify, minify, and compress"
	@echo "make scripts:  Just builds the scripts"
	@echo "make sass:     Just builds the stylesheets"
	@echo "make test:     Prepares and runs the tests"
	@echo "make uglify:   uglify app.js -> app.min.js"


.PHONY: build clean cloc dist sass scripts serve shrink-node test uglify watch

build: clean
	$(gulp) build

clean:
	rm -rf dist/

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang --force-lang="Javascript",es6

dist: | clean build uglify

sass:
	$(gulp) sass

scripts:
	$(gulp) browserify

serve: clean
	$(gulp) watch

shrink-node:
	npm dedupe
	dmn clean -list

test:
	npm test

check-updates:
	npm outdated --depth 0

uglify:
	$(uglifyjs) dist/app.js \
		--screw-ie8 -c --stats \
		--in-source-map dist/app.js.map \
		--source-map app.js.min.map \
		-o dist/app.min.js
	mv app.js.min.map dist/

watch: clean
	$(gulp) watch
