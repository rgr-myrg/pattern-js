var	karma		= require( "karma" ).Server,
	pkg         = require("./package.json"),
	JSCS		= require( "jscs" ),
	gulp    	= require( "gulp" ),
	gutil 		= require( "gulp-util" ),
	chalk 		= require( "chalk" ),
	jshint  	= require( "gulp-jshint" ),
	concat  	= require( "gulp-concat" ),
	uglify  	= require( "gulp-uglify" ),
	header  	= require( "gulp-header" ),
	wrapper 	= require( "gulp-wrapper" ),
	watch		= require( "gulp-watch" ),
	nodeFS  	= require( "fs" ),
	browserSync = require( "browser-sync" ),
	browserify  = require( "browserify" ),
	nodeFTP 	= require("jsftp"),
	istanbul 	= require( "browserify-istanbul" ),
	shell 		= require( "gulp-shell" ),
	color		= require( "chalk" ),
	log			= require( "gulp-util" ).log,
	replace     = require( "gulp-replace" );

var	headerText  = "/* {artifact} v{version} {date} */",

	artifactId  = "pattern",

	packaging   = "js",

	targetPath  = "dist",

	sourcePath  = "src",
	
	testPath = "test",
	
	textSuffix = ".Spec",

	sourceFiles = [

		"global/*.js",
		"eventsignal/*.js",
		"notifier/*.js",
		"observer/*.js",
		"pubsub/*.js",
		"queue/*.js"

	],
	
	lintFiles = sourceFiles.filter( function( item ) {
		return item.indexOf( "lib/" ) === -1
	}),
	
	watchDirectories = [
		"src/**/*.js", 
		"test/*.js"
	],
	
	codeStyleSettings = {
		preset: "idiomatic",
		validateIndentation: "\t"	
	},

	jshintConfig = pkg.jshintConfig,
	
	buildSource = [],
	
	jsDocLocation = "./documentation",

	wrapHeader = "(function(w){w.Pattern=w.Pattern||{};})(window);(function($P){";

	wrapFooter  = "$P.version='" + pkg.version + "';})(Pattern);",
	
	sourceBentoFile = "./dist/pattern.js",
	
	sourceBentoMinFile = "./dist/pattern.min.js";

var	artifactDebug = "/" + artifactId + "." + packaging,
	artifactMini  = "/" + artifactId + ".min." + packaging;

gulp.task( "init", function() {

	// Create new array of sourceFiles appended with the proper source directory.
	buildSource = sourceFiles.map( function( file ) {
		return sourcePath + "/" + file;
	});
	
	lintFiles = buildSource.filter( function( item ) {
		return item.indexOf( "lib/" ) === -1
	});
	
	// Check for dist folder existence, create if not found.	
	if ( !nodeFS.existsSync( targetPath ) ) {
		nodeFS.mkdirSync( "./" + targetPath );
	}

	// Prepare header text with timestamp
	headerText = headerText
		.replace( /{artifact}/, pkg.name )
		.replace( /{version}/, pkg.version )
		.replace( /{date}/, (new Date).toString() );

});

gulp.task( "clean", [ "init" ], function() {

	var	path  = nodeFS.realpathSync( targetPath ),
		files = nodeFS.readdirSync( path );
		
	files.forEach( function ( file, index, files ) {
		if ( files.hasOwnProperty( index ) ) {
			nodeFS.unlinkSync( path + "/" + file );
		}
	});

});

gulp.task( "lint", [ "clean" ], function() {

	return gulp.src( lintFiles )

		.pipe( jshint( jshintConfig ) )
		.pipe( jshint.reporter( "default" ) )
		.pipe( jshint.reporter( "fail" ) );

});

gulp.task( "concat", [ "lint" ], function() {

	return gulp.src( buildSource )

		.pipe( concat( artifactDebug ) )

		.pipe(

			wrapper({

				header: wrapHeader,
				footer: wrapFooter

			})

		)

		.pipe( header( headerText ) )
		.pipe( gulp.dest( targetPath ) );

});

gulp.task( "minify", [ "concat" ], function() {

	//return gulp.src( buildSource )
	return gulp.src( targetPath + artifactDebug )

		.pipe( concat( artifactMini ) )

		.pipe(

			uglify({
				compress: {
					drop_console: true
				}
			}) 

		)

		.pipe( header( headerText ) )

		.pipe( gulp.dest( targetPath ) );

});

gulp.task( "browserify", [ "minify" ], function() {

	return browserify( gulp.src( "dist" ) )

		.transform( istanbul() );

});

gulp.task( "test", [ "browserify" ], function ( done ) {

	var server = new karma({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true

	}, function( exitCode ) {

		if ( exitCode === 0 ) {

			return done();

		} else {
			process.exit( 1 );

		};

	});

	server.start();

});

gulp.task( "priority-tests", [ "minify" ], function ( done ) {

	var changedFileName = require( "path" ).basename( lastChangedFile ).replace( /\.[^/.]+$/, "" ),
		files = [];
		
	changedFileName.indexOf( textSuffix ) === -1 ? ( changedFileName = changedFileName + textSuffix + "." + packaging ) : ( changedFileName = changedFileName + "." + packaging );
	
	if ( nodeFS.existsSync( testPath + "/" + changedFileName ) ) {
		files = [
			targetPath + "/pattern.min.js",
			testPath + "/datapoints/*",
			testPath + "/" + changedFileName
		]
	}

	if ( files.length ) {
		
		var server = new karma({
			configFile: __dirname + "/karma.conf.js",
			files: files

			}, function( exitCode ) {

				return done();


		});

		server.start();

	} else {

		if ( changedFileName.indexOf( "Vars" ) === -1 ) {
		
			console.log( "" );
			
			log( color.red.bold( "Please provide tests for " + lastChangedFile + " if applicable!" + "\n" ) );
		
		}

		done();
	}

});

gulp.task( "watch", function () {

	var watch = gulp.watch( watchDirectories, [ "priority-tests" ] );
	
	watch.on( "change", function( event ) {
	
		lastChangedFile = event.path;

	});

});

gulp.task( "document", [ "test" ], shell.task(
	[ "jsdoc --private -c jsdoc.json --readme README.md -d " + jsDocLocation ]
));

gulp.task( "default", [ "watch", "minify" ] );
gulp.task( "finalize", [ "test" ]  );
gulp.task( "release", [ "document" ] );
