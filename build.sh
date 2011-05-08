#!/bin/bash
#Build Script for http://DevShop.Me

VERSION="0.1"
ARTIFACT="devshop.js"
JS_FILES="--js src/core.js --js src/singletonfactory.js --js src/observable.js --js src/observer.js --js src/eventsignal.js --js src/mvc.js"
JS_BUILD="build/$ARTIFACT"
JS_TEMP="build/tmp.js"
EXAMPLE="examples/devshop.js"
LICENSE="LICENSE"
PACKAGES=(eventsignal mvc observer singletonfactory);

echo -n "Compiling..."

for i in "${PACKAGES[@]}"
do :
	case "$i" in
		"eventsignal")
		files="--js src/core.js --js src/eventsignal.js"
	;;
	esac
	case "$i" in
		"mvc")
		files="--js src/core.js --js src/singletonfactory.js --js src/observable.js --js src/observer.js --js src/mvc.js"
	;;
	esac
	case "$i" in
		"observer")
		files="--js src/core.js --js src/singletonfactory.js --js src/observable.js --js src/observer.js"
	;;
	esac
	case "$i" in
		"singletonfactory")
		files="--js src/core.js --js src/singletonfactory.js"
	;;
	esac
	artifact="build/devshop-"$i".js"
	java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS $files --js_output_file $JS_TEMP
	cat $LICENSE $JS_TEMP > $artifact
	rm $temp
done

java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS $JS_FILES --js_output_file $JS_TEMP
cat $LICENSE $JS_TEMP > $JS_BUILD
echo -n "Created $JS_BUILD"
cp -p $JS_TEMP $EXAMPLE
rm $JS_TEMP

if [ $? -ne 0 ]; then
	exit 1
fi
	echo "OK"

##java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js src/core.js --js src/observer.js --js src/observable.js --js src/singletonfactory.js --js_output_file build/devshop-observer-0.1.js 

