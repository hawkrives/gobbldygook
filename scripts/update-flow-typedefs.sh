#!/bin/bash

cd modules/ || exit 1

for module in *; do
	echo "$module"

	cd $module || exit 1

	flow-typed update --libdefDir ../../flow-typed/ --packageDir ../../

	cd .. || exit 1
done

cd .. || exit 1

bash scripts/trim-flow-typed-generic-defs.sh
