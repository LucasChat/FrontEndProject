var gulp 			= require('gulp');
var concat 		= require('gulp-concat');
var sass  		= require('gulp-sass');
var watch  		= require('gulp-watch');
var plumber 	= require('gulp-plumber')

gulp.task('default', function() {

  gulp.watch( 'js/app/controllers/*.js', ['js_app']);

  gulp.watch( 'sass/**/*.scss', ['sass']);

  gulp.watch( 'js/vendor/*.js', ['js_libs']);

});

// App
gulp.task('js_app', function() {

  return gulp.src('js/app/controllers/*.js')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat("app.js"))
        .pipe(gulp.dest('js/dist/'))

});

// Sass
gulp.task('sass', function()
{
  return gulp.src( 'sass/**/*.scss' )
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(sass({
          indentedSyntax: false
        }))
        .pipe(gulp.dest( 'stylesheets/' ))
});

// Vendors
gulp.task('js_libs', function() {

  return gulp.src('js/vendor/*.js')
        .pipe(plumber({
          errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest('js/dist/'))

});
