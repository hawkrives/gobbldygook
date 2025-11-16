#!/bin/bash
set -e

# Generate the parser
pegjs --allowed-start-rules Result,Filter < ./parse-hanson-string.pegjs > ./parse-hanson-string.js

# Remove the CommonJS module.exports
sed -i '/^module\.exports = {$/,/^};$/d' ./parse-hanson-string.js

# Add ES6 exports
cat >> ./parse-hanson-string.js << 'EXPORTS'

// ES6 exports for compatibility with TypeScript
export { peg$SyntaxError as SyntaxError, peg$parse as parse };
EXPORTS

# Format with prettier to ensure consistency
../../node_modules/.bin/prettier --write ./parse-hanson-string.js

echo "Parser built successfully with ES6 exports"
