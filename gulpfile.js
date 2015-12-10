var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    Q = require('q');

var config = {
    production: !!$.util.env.production,
    sourceMaps: !$.util.env.production
}

// MAIN PATHS
var paths = {
    scripts: 'src/js/'
}

// BUILD TARGET CONFIG
var build = {
    scripts: 'dist/js'
};

// SOURCES CONFIG
var source = {
    scripts: [
        paths.scripts + '*.js'
    ]
};

var app = {};

app.addScript = function (paths, outputFilename) {
    return gulp.src(paths)
        .pipe($.plumber())
        .pipe($.if(config.sourceMaps, $.sourcemaps.init()))
        .pipe(gulp.dest(build.scripts))
        //jslint - problems only with no defined angular varaible
        //.pipe($.jslint())
        .pipe(config.production ? $.uglify() : $.util.noop())
        .pipe($.if(config.production, $.rename({extname: '.min.js'})))
        .pipe($.if(config.sourceMaps, $.sourcemaps.write('.')))
        .pipe(gulp.dest(build.scripts));
};

// Error handler
app.handleError = function (err) {
    app.log(err.toString());
    this.emit('end');
}

// log to console using
app.log = function log(msg) {
    $.util.log($.util.colors.blue(msg));
}

var Pipeline = function () {
    this.entries = [];
};
Pipeline.prototype.add = function () {
    this.entries.push(arguments);
};
Pipeline.prototype.run = function (callable) {
    var deferred = Q.defer();
    var i = 0;
    var entries = this.entries;
    var runNextEntry = function () {
        // see if we're all done looping
        if (typeof entries[i] === 'undefined') {
            deferred.resolve();
            return;
        }
        // pass app as this, though we should avoid using "this"
        // in those functions anyways
        callable.apply(app, entries[i]).on('end', function () {
            i++;
            runNextEntry();
        });
    };
    runNextEntry();
    return deferred.promise;
};

gulp.task('scripts', function () {
    var pipeline = new Pipeline();

    pipeline.add(source.scripts);

    return pipeline.run(app.addScript);
});

gulp.task('clean', function () {
    del.sync(build.scripts);
});

gulp.task('watch', function () {
    app.log('Starting watch');

    gulp.watch(source.scripts, ['scripts']);
});

gulp.task('server', function () {
    gulp.src('.')
        .pipe($.serverLivereload({
            livereload: true,
            open: true
        }));
});

gulp.task('assets', ['scripts']);

var tasks = ['clean', 'assets'];
if (!config.production) {
    tasks.push('watch');
}

gulp.task('default', tasks);