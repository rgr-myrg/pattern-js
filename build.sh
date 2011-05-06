#!/bin/bash
#Build Script for http://DevShop.Me

VERSION="0.1-SNAPSHOT"
ARTIFACT="devshop-$VERSION.js"
JS_FILES="--js src/core.js --js src/singletonfactory.js --js src/observable.js --js src/observer.js"
JS_BUILD="build/$ARTIFACT"
JS_TEMP="build/tmp.js"
LICENSE="LICENSE"

echo -n "Compiling...\n"

java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS $JS_FILES --js_output_file $JS_TEMP

cat $LICENSE $JS_TEMP > $JS_BUILD

echo -n "Created $JS_BUILD\n"

rm $JS_TEMP

if [ $? -ne 0 ]; then
	exit 1
fi
	echo "OK"

##java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js src/core.js --js src/observer.js --js src/observable.js --js src/singletonfactory.js --js_output_file build/devshop-observer-0.1.js 

