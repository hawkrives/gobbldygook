#!/usr/bin/env bash
# Lists the JS files that still use Flow syntax. oxfmt refuses to parse Flow
# (and oxlint silently skips @flow files), so `mise run format` excludes these
# until they are converted to TypeScript.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
{
  git grep -l -e '@flow' -- 'modules/*.js' 'config/*.js'
  git ls-files 'config/decls/*.js'
} | sort -u
