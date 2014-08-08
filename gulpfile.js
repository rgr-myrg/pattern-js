var	headerFile  = "LICENSE",
	 artifactId  = "pattern-full",
	// artifactId  = "pattern-observer",
	// artifactId  = "pattern-pubsub",
	// artifactId  = "pattern-mvc",
	version     = "1.0.0",
	packaging   = "js",
	targetPath  = "build",
	sourcePath  = "src",
	 sourceFiles = [ "Queue.js", "ObjectFactory.js", "Observable.js", "Observer.js", "EventSignal.js", "Publisher.js", "MVC.js" ];
	// sourceFiles = [ "Queue.js", "ObjectFactory.js", "Observable.js", "Observer.js" ];
	// sourceFiles = [ "Queue.js", "ObjectFactory.js", "EventSignal.js", "Publisher.js" ];
	// sourceFiles = [ "Queue.js", "ObjectFactory.js", "MVC.js" ];

var	gulp   = require( "gulp" ),
	jshint = require( "gulp-jshint" ),
	concat = require( "gulp-concat" ),
	uglify = require( "gulp-uglify" ),
	header = require( "gulp-header" ),
	google = require( "gulp-closure-compiler" );
	nodeFS = require( "fs" ),
	gccJAR = "lib/compiler.jar",
	gccOPT = "SIMPLE_OPTIMIZATIONS";

var	topNameSpace = function() {
		return "(function(w){w.Pattern=w.Pattern||{};})(window);";
	},
	getHeaderFile = function() {
		return nodeFS.readFileSync( headerFile, {encoding: "utf8"} )
			.replace( /{version}/, version )
			.replace( /{date}/, (new Date).toString() )
			+ topNameSpace();
	};

var	artifactDebug = version + "/" + artifactId + ".debug." + packaging,
	artifactMini  = version + "/" + artifactId + "." + packaging;

gulp.task( "init", function() {
	var size = sourceFiles.length;

	for ( var x = 0; x < size; x++ ) {
		sourceFiles[ x ] = sourcePath + "/" + sourceFiles[ x ];
		console.log( "Adding " + sourceFiles[ x ] );
	}
});

gulp.task( "clean", function() {
	var	path  = nodeFS.realpathSync( targetPath + "/" + version),
		files = nodeFS.readdirSync( path );

	for( var i in files ) {
		if ( files.hasOwnProperty( i ) ) {
			console.log( "Removing " + targetPath + "/" + files[ i ] );
			nodeFS.unlink( path + "/" + files[ i ], function( e ){if(e)console.log( e );} );
		}
	}
});

gulp.task( "lint", function() {
	return gulp.src( sourcePath )
		.pipe( jshint() )
		.pipe( jshint.reporter( "default" ) );
});

gulp.task( "concat", function() {
	return gulp.src( sourceFiles )
		.pipe( concat( artifactDebug ) )
		.pipe( header( getHeaderFile() ) )
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "google-cc", function() {
	return gulp.src( sourceFiles )
		.pipe( concat( artifactDebug ) )
		.pipe(
			google({
				compilerPath: gccJAR,
				fileName: artifactMini,
				compilerFlags: {
					compilation_level: gccOPT,
					js_output_file: artifactMini
				}
			})
		)
		.pipe( header( getHeaderFile() ) )
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "default", ["init", "lint", "concat", "google-cc"] );
