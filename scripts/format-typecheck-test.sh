#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Install the existing lockfile with npm ci --legacy-peer-deps before running.
printf '\nChecking formatting\n'
./node_modules/.bin/prettier --check \
  .eslintrc.js .prettierrc package.json package-lock.json \
  'src/**/*.js' 'test/**/*.js'
./node_modules/.bin/prettier --check --parser babel bin/static-site-image-width-height-enricher

printf '\nChecking JavaScript syntax\n'
for file in .eslintrc.js src/*.js test/*.js bin/static-site-image-width-height-enricher; do
  node --check "$file"
done
printf 'Static typechecking is not configured for this JavaScript project\n'

printf '\nRunning tests\n'
npm test -- --runInBand
