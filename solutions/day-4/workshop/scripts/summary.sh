#!/bin/sh
rm -rf summary
rm -rf coverage
mkdir summary
cp packages/common/coverage/coverage-final.json summary/common.json
cp packages/components/coverage/coverage-final.json summary/components.json
cp packages/app/coverage/coverage-final.json summary/app.json
nyc -t ./summary report --reporter=html
rm -rf summary