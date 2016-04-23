var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var eslint = require('gulp-eslint');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');

var config = {
  port: 7780,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/js/**/*.js',
    libs: [
      './node_modules/jquery/dist/jquery.js',
      './node_modules/superagent/superagent.js',
      './src/js/standalone/wavesurfer.min.js',
      './src/js/standalone/twitter_embed.js'
    ],
    css: [
      './src/css/reset.css',
      './src/css/vcenter.css',
      './src/css/main.css',
    ],
    cssLibs: [
      './src/css/twitter_embed.css'
    ],
    images: './src/images/*',
    dist: './dist',
    mainJs: './src/js/main.js',
    emojis: '//twemoji.maxcdn.com/twemoji.min.js'
  }
};

gulp.task('clean', function(cb) {
  rimraf('dist', cb);
});

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

  gulp.src(config.paths.cssLibs)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist + '/css'))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  gulp.src(config.paths.libs)
    .pipe(gulp.dest(config.paths.dist + '/js'));

  browserify(config.paths.mainJs, { debug: true })
    .transform('babelify', {
      plugins: ['transform-runtime'],
      presets: ['es2015', 'react']
    })
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) // writes .map file
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
  gulp.watch(config.paths.css.concat(config.paths.cssLibs), ['css']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('build-dev', ['html', 'js', 'css', 'images', 'lint']);
gulp.task('build', function(cb) {
  process.env.NODE_ENV = 'production';
  runSequence('clean', ['html', 'js', 'css', 'images'], cb);
});
gulp.task('default', ['build-dev', 'connect', 'watch']);
