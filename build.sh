#!/bin/bash
#Build Script for http://DevShop.Me

JS_TEMP="build/tmp.js"
LICENSE="LICENSE"
PACKAGES=(eventsignal mvc observer singletonfactory full);

echo -n "Compiling..."

for i in "${PACKAGES[@]}"
do :
	case "$i" in
		"eventsignal")
		files="--js src/core.js --js src/eventsignal.js"
	;;
	esac
	case "$i" in
		"publisher")
		files="--js src/core.js --js src/eventsignal.js --js src/publisher.js"
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
	case "$i" in
		"full")
		files="--js src/core.js --js src/singletonfactory.js --js src/observable.js --js src/observer.js --js src/eventsignal.js --js src/mvc.js --js src/publisher.js"
	;;
	esac
	artifact="build/devshop-"$i".js"
	java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS $files --js_output_file $JS_TEMP
	cat $LICENSE $JS_TEMP > $artifact
	rm $JS_TEMP
done

cp -p build/devshop-full.js examples/devshop-full.js

if [ $? -ne 0 ]; then
	exit 1
fi
	echo "OK"
 

