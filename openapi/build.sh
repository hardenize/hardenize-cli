#!/usr/bin/env bash
set -e

## Fetch the client lib auto-generator if it's not already here
if [[ ! -f "openapi-generator-cli.jar" ]]; then
    wget http://central.maven.org/maven2/org/openapitools/openapi-generator-cli/3.2.1/openapi-generator-cli-3.2.1.jar -O openapi-generator-cli.jar
fi

## Regenerate openapi client lib
rm -rf dist
java -jar openapi-generator-cli.jar generate -i hardenize-org-api-v0.openapi.yaml -g javascript -o dist

## Add additional files to the client lib
cp -rv src dist/
cd dist

## Apply patches to the client lib
ls ../patches/ | awk {'print "patch -p0 < ../patches/"$1'} | sh
