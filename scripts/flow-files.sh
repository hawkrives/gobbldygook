#!/usr/bin/env bash
# Lists the JS files that still use Flow syntax. oxlint and oxfmt cannot parse
# Flow, so these files stay on ESLint and Prettier until they become TypeScript.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
{
  git grep -l -e '@flow' -- 'modules/*.js' 'config/*.js'
  git ls-files 'config/decls/*.js'
} | sort -u
