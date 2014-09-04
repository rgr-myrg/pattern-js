var	headerFile  = "LICENSE",
	artifactId  = "pattern",
	version     = "1.0.1",
	packaging   = "js",
	targetPath  = "dist",
	sourcePath  = "src",
	sourceFiles = [ 
		"Queue.js", 
		"ObjectFactory.js", 
		"Observable.js", 
		"Observer.js", 
		"EventSignal.js", 
		"Publisher.js",
		"MVC.js"
	];

var	gulp   = require( "gulp" ),
	jshint = require( "gulp-jshint" ),
	concat = require( "gulp-concat" ),
//	uglify = require( "gulp-uglify" ),
	header = require( "gulp-header" ),
	google = require( "gulp-closure-compiler"),
    wrap   = require( "gulp-wrapper" ),
	nodeFS = require( "fs" ),
	gccJAR = "lib/compiler.jar",
	gccOPT = "SIMPLE_OPTIMIZATIONS";

var	topNameSpace = function() {
		return "(function(w){w.Pattern=$P=w.Pattern||{};})(window);";
	},
	getHeaderFile = function() {
		return nodeFS.readFileSync( headerFile, {encoding: "utf8"} )
			.replace( /{version}/, version )
			.replace( /{date}/, (new Date).toString() )
			+ topNameSpace();
	};

var	artifactDebug = artifactId + ".debug." + packaging,
	artifactMini  = artifactId + "." + packaging;

gulp.task( "init", function() {
	var size = sourceFiles.length;

	for ( var x = 0; x < size; x++ ) {
		sourceFiles[ x ] = sourcePath + "/" + sourceFiles[ x ];
		console.log( "Adding " + sourceFiles[ x ] );
	}
});

gulp.task( "clean", function() {
	var	path  = nodeFS.realpathSync( targetPath ),
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
		.pipe(
			wrap({
			header: "(function($P){",
			footer: "})(Pattern);"
		}))
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
		.pipe(
			wrap({
			header: "(function($P){",
			footer: "})(Pattern);"
		}))
		.pipe( header( getHeaderFile() ) )
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "default", ["init", "lint", "concat", "google-cc"] );
