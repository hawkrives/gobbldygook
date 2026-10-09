---
"@gob/cli": minor
"@gob/hanson-format-cli": minor
"@gob/search-queries-cli": minor
---

The command-line tools now run their TypeScript source directly on Node, which strips the types itself, instead of compiling it with Babel on every run. They need Node 22.18 or newer.
