var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webpack = require('webpack-stream');
var buffer = require('vinyl-buffer');

var config = {
  port: 7780,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/js/**/*.js',
    css: [
      './src/css/reset.css',
      './src/css/vcenter.css',
      './src/css/main.css'
    ],
    images: './src/images/*',
    dist: './dist',
    mainJs: './src/js/main.js'
  }
};

gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp
    .src(config.paths.html)
    .pipe(minifyHtml())
    .pipe(gulp.dest(config.paths.dist))
    .pipe(sourcemaps.write('./'))
    .pipe(connect.reload());
});

gulp.task('css', function() {
  gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist + '/css'))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src(config.paths.mainJs)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist + '/js'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(config.paths.dist + '/images'))
    .pipe(connect.reload());
});

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.css, ['css']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('build', ['html', 'js', 'css', 'images', 'lint']);
gulp.task('default', ['build', 'connect', 'watch']);
