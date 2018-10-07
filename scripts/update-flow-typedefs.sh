#!/bin/bash

cp package.json package-root.json

for module in modules/*; do
	echo "$module"

	cp "$module/package.json" ./package.json
	yarn add --dev flow-bin@^0.81.0

	flow-typed update
done

mv package-root.json package.json
rm package-root.json

bash scripts/trim-flow-typed-generic-defs.sh
