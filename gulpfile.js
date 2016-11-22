var gulp = require('gulp');  
    run = require('gulp-run');
   // livereload = require('gulp-livereload');
   // uglify = require('gulp-uglify'),
    //concat = require('gulp-concat'),
    //rename = require('gulp-rename'),
    //minifycss = require('gulp-minify-css'),
    //jshint = require('gulp-jshint'),
    //autoprefixer = require('gulp-autoprefixer'),
    //rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');  
var del = require('del');  
var sass = require('gulp-sass');  
var ts = require('gulp-typescript');  
var sourcemaps = require('gulp-sourcemaps');  
var browserSync = require("browser-sync").create();  
var reload = browserSync.reload;  
var config = require('./gulp.config')();  
var tscConfig = require('./tsconfig.json');
var electron      = require('electron');


// clean the contents of the distribution directory
gulp.task('clean', function () {  
  return del(['dist']);
});

var typingFiles = [  
  'typings/browser.d.ts'
];

gulp.task('serve', ['build'], function () {  
  browserSync.init(config.browserSync.dev);
  gulp.watch([config.sass.watch], ['sass']);
  gulp.watch(['app/**/*'], ['compile', 'copy:assets']).on('change', reload);
  gulp.watch(['public/index.html'], ['copy:index']).on('change', reload);
});
/*gulp.task('watch', function(){
  livereload.listen();
  gulp.watch([config.sass.watch], ['sass']);*/
  //gulp.watch(['app/**/*'], ['compile', 'copy:assets']).on('change', reload);
  /*gulp.watch(['public/index.html'], ['copy:index']).on('change', reload);
})*/

gulp.task('run', ['build'], function() {
  return run('electron .').exec();
});

gulp.task('fonts', function () {  
  return gulp
    .src(config.fonts.in)
    .pipe(gulp.dest(config.fonts.out));
});

gulp.task('sass', ['fonts'], function () {  
  return gulp.src(config.sass.in)
    .pipe(sass(config.sass.sassOpts))
    .pipe(gulp.dest(config.sass.out))
    .pipe(browserSync.stream());
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', function () {  
  return gulp.src(['app/**/*', '!app/**/*.ts'], {base: './'})
    .pipe(gulp.dest('dist'))
});

gulp.task('copy:index', function () {  
  return gulp.src(['public/index.html', 'public/systemjs.config.js'])
    .pipe(gulp.dest('dist'))
});

/// copy dependencies
gulp.task('copy:libs', function () {  
  return gulp.src([
      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/zone.js/dist/**',
      'node_modules/reflect-metadata/temp/Reflect.js',
      'node_modules/rxjs/**',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/@angular/**'
    ], {base: './node_modules'})
    .pipe(gulp.dest('dist/lib'))
});

var typingFiles = [  
  'typings/browser.d.ts'
];

// TypeScript compile
gulp.task('compile', function () {  
  var tsResult = gulp.src('app/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(ts(tscConfig.compilerOptions));
  return tsResult.js
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('build', function(cb) {  
  runSequence('clean', ['compile', 'copy:libs','copy:assets', 'copy:index', 'sass'], cb);
});

gulp.task('default', ['build']); 