

const gulp = require('gulp');
const concat = require('gulp-concat');
const exec = require('gulp-exec');
const watch = require('gulp-watch');
const livereload = require('gulp-livereload');
const sass = require('gulp-sass');
const lr = require('tiny-lr');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');

var server = lr();
/*
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    exec = require('gulp-exec'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),

    lr = require('tiny-lr'),
    server = lr();

*/
gulp.task( 'template', function () {
  return gulp.src(['*.hbs','partials/*.hbs'])
    .pipe( livereload( server ));
});


/*
gulp.task( 'style', function () {
  return gulp.src( [
      'bower_components/normalize-css/normalize.css',
      'dev/styles/boilerplate.css',
      'dev/styles/main.css'
    ])
    .pipe( concat( 'main.css' ))
    .pipe( gulp.dest( 'assets/css' ))
    .pipe( livereload( server ));
});
*/

gulp.task('fonts', function(){
  return gulp.src('dev/fonts/**/*')
    .pipe(gulp.dest('assets/css/fonts/'));
});

gulp.task('img', function(){
  return gulp.src('dev/img/**/*')
    .pipe(gulp.dest('assets/img/'));
});

gulp.task('sass', function(){
  return gulp.src('dev/scss/**/*.scss')
    .pipe(sass(
      {
        errLogToConsole: true,
        includePaths: [
          'node_modules/foundation-sites/scss',
          'node_modules/motion-ui/src',
        ],
      }
    ))
    .pipe(gulp.dest('assets/css/'))
    .pipe(livereload(server));
});


gulp.task('scripts', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: 'dev/scripts/main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/js/'));
});
/*
gulp.task( 'scripts', function () {
  return gulp.src( [
      'dev/scripts/main.js'
    ])
    .pipe( concat( 'main.js' ))
    .pipe( gulp.dest( 'assets/js' ))
    .pipe( livereload( server ));
});

gulp.task( 'lib', function () {
  return gulp.src( [
      'bower_components/modernizr/modernizr.js',
      'dev/scripts/livereload.js'
    ])
    .pipe( concat( 'lib.js' ))
    .pipe( gulp.dest( 'assets/js' ))
    .pipe( livereload( server ));
});
*/



gulp.task('ghost', function() {
  gulp.src('')
    .pipe(exec( 'cd ../../../; npm start' ));
});

gulp.task('watch', function() {
  // Listen on port 35729
  server.listen( 35729, function ( err ) {
    if ( err ) {
     return console.log( err );
    };

    gulp.watch( 'dev/scss/*.scss', ['sass'] );
    gulp.watch( 'dev/scripts/*.js', ['scripts'] );
    gulp.watch( '*.hbs', ['template'] );
  });
});


gulp.task( 'default', ['fonts', 'img', 'sass', 'scripts'], function() {
    gulp.start( 'ghost', 'watch' );
});
