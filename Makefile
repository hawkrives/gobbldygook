BROWSERIFY_TRANSFORMS = -t 6to5-browserify
BROWSERIFY_OPTS = --debug $(BROWSERIFY_TRANSFORMS)

sass         = node node_modules/node-sass/bin/node-sass
browserify   = node node_modules/browserify/bin/cmd.js
watchify     = node node_modules/watchify/bin/cmd.js
http-server  = node node_modules/http-server/bin/http-server
autoprefixer = node node_modules/autoprefixer/autoprefixer

all: build

.PHONY: clean script style serve test

setup:
	mkdir -p dist
	ln -Ffs ../data ./dist/data
	ln -Ffs ../app/styles/fonts ./dist/fonts
	ln -Ffs ../app/styles/ionicons/fonts ./dist/ionicons
	cp app/index.html dist/index.html

script: setup
	$(watchify) $(BROWSERIFY_OPTS) app/app.js -o dist/app.js
	# jshint
	# jscs(?)

test:
	$(browserify) $(BROWSERIFY_OPTS) test/testChemistryMajor.js -o test/testChemistryMajor.es5.js

script-once:
	$(browserify) $(BROWSERIFY_OPTS) app/app.js -o dist/app.js

style: setup
	$(sass) --watch app/styles/app.scss -o dist/app.css
	# $(autoprefixer) -m dist/app.css

serve:
	$(http-server) ./dist -o

build:
	$(browserify) $(BROWSERIFY_OPTS) app/app.js -o dist/app.js
	$(sass) app/styles/app.scss -o dist/app.css
	$(autoprefixer) -m dist/app.css
	# cssshrink
	# colorguard
	# uglifyjs

cloc:
	cloc . --exclude-dir=data,node_modules,dist,.idea,test --by-file-by-lang

clean:
	rm -rf .sass_cache .tmp ./dist
