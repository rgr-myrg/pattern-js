#!/bin/bash

echo -n "Installing gulp"

sudo npm install -g gulp
sudo npm install --save-dev gulp

echo -n "Installing packages"

sudo npm install gulp-jshint gulp-concat gulp-uglify gulp-header gulp-remote-src gulp-closure-compiler --save-dev

echo -n "Installation finished"

if [ $? -ne 0 ]; then
	exit 1
fi
	echo "OK"
 