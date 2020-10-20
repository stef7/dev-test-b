// gulpfile.babel.js
// All this will error out if you don't use Babel

import gulp from "gulp";
import sass from "gulp-sass";
import browserSync from "browser-sync";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import webpack from "webpack-stream";

const sassOptions = { outputStyle: "expanded", errLogToConsole: true };

exports.sass = () =>
  gulp
    .src("./src/scss/styles.scss")
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.reload({ stream: true }));

exports.js = () =>
  gulp
    .src("./src/js/app.js")
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    //.pipe(uglify())
    //.pipe(concat('app.js'))
    .pipe(webpack())
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));

exports.copy = () =>
  gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.reload({ stream: true }));

gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      index: "index.html",
    },
    notify: false,
    injectChanges: true,
  });
  gulp.watch("./src/scss/**/*", gulp.series("sass"));
  gulp.watch("./src/js/**/*", gulp.series("js"));
  gulp.watch("./src/*.html", gulp.series("copy"));
  gulp.watch("./dist/*").on("change", browserSync.reload);
});

gulp.task("default", gulp.series("serve"));
