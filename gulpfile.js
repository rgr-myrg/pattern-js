var gulp   = require("gulp");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var nodeFs = require("fs");
var build  = require("./package.json");
var header = require("gulp-header");
var footer = require("gulp-footer");
var karma  = require("karma").Server;

var jsFile = build.name + build.packaging;
var jsName = build.buildPath + "/" + jsFile;
var jsHead = [build.infoString, build.namespace, build.jsVersion, build.jsClosureOpen]
	.join("\n")
	.replace(/{date}/, (new Date).toString());

gulp.task("clean", function() {
    if (!nodeFs.existsSync(build.buildPath)) {
        nodeFs.mkdirSync(build.buildPath);
    }

    var path  = nodeFs.realpathSync(build.buildPath);
	var files = nodeFs.readdirSync(path);

	files.forEach(function(file, index, files) {
		if (files.hasOwnProperty(index)) {
			nodeFs.unlinkSync(path + "/" + file);
		}
	});
});

gulp.task("lint", ["clean"], function() {
	return gulp.src(build.sourcePath)
		.pipe(jshint(build.jshintConfig))
		.pipe(jshint.reporter("default"))
		.pipe(jshint.reporter("fail"));
});

gulp.task("package", ["lint"], function() {
	return gulp.src(build.sourcePath)
		.pipe(concat(jsFile))
		.pipe(header(jsHead, { build: build }))
        .pipe(footer(build.jsClosureClose))
		.pipe(gulp.dest(build.buildPath));
});

gulp.task("minify", ["package"], function() {
	return gulp.src(jsName)
		.pipe(gulp.dest(build.buildPath))
		.pipe(uglify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest(build.buildPath));
});

gulp.task("single-run-tests", ["minify"], function(done) {
	var server = new karma({
		configFile: __dirname + build.karmaConf,
		singleRun: true
	}, function(exitCode) {
		process.exit(1);
	});

	server.start();
});

gulp.task("start-tests", ["minify"], function() {
//	var server = new karma({
//		configFile: __dirname + build.karmaConf,
//		action: "watch"
//	});

	var server = new karma({
		configFile: __dirname + build.karmaConf
	});

	server.start();
});

gulp.task("watch", function() {
	var watch = gulp.watch([build.sourcePath, build.testPath], ["start-tests"]);

//	watch.on("change", function(event) {
//	});
});

gulp.task("default", ["single-run-tests"]);
