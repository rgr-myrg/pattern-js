var	headerFile  = "LICENSE",
	artifactId  = "devshop",
	version     = "1.0.0",
	packaging   = "js",
	targetPath  = "build",
	sourcePath  = "src",
	sourceFiles = [
		"singletonfactory.js",
		"observable.js",
		"observer.js",
		"eventsignal.js",
		"mvc.js",
		"publisher.js"
	];

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
		return "(function(w){w.DevShop=w.devshop=w.DevShop||{};})(window);";
	},
	getHeaderFile = function() {
		return nodeFS.readFileSync( headerFile, {encoding: "utf8"} )
			.replace( /{version}/, version )
			.replace( /{date}/, (new Date).toString() )
			+ topNameSpace();
	};

var	artifactName = artifactId + "_" + version + "." + packaging,
	artifactMini = artifactId + "_" + version + ".min." + packaging,
	artifactCC   = artifactId + "_" + version + ".cc." + packaging;

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
		.pipe( concat( artifactName ) )
		.pipe( header( getHeaderFile() ) )
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "minify", function() {
	return gulp.src( sourceFiles )
		.pipe( concat( artifactMini ) )
		.pipe( uglify() )
		.pipe(
			header( getHeaderFile() )
		)
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "google-cc", function() {
	return gulp.src( sourceFiles )
		.pipe( concat( artifactName ) )
		.pipe(
			google({
				compilerPath: gccJAR,
				fileName: artifactCC,
				compilerFlags: {
					compilation_level: gccOPT,
					js_output_file: artifactCC
				}
			})
		)
		.pipe( header( getHeaderFile() ) )
		.pipe( gulp.dest( targetPath ) );
});

gulp.task( "default", ["init", "lint", "concat", "minify", "google-cc"] );
