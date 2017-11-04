import gulp from 'gulp';
// import babel from 'gulp-babel';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import nunjucks from 'gulp-nunjucks';
import sass from 'gulp-sass';
import del from 'del';

const baseSrc = './src';
const baseDist = './dist';

const dirs = {
  sassPaths: {
    src: `${ baseSrc }/css/**/*.scss`,
    dist: `${ baseDist }/style/`
  },
  scriptsPaths: {
    src: `${ baseSrc }/scripts/**/*.js`,
    dist: `${ baseDist }/scripts/`
  },
  assetsPaths: {
    src: `${ baseSrc }/assets/**/*`,
    dist: `${ baseDist }/assets/`
  },
  templatePaths: {
    src: `${ baseSrc }/**/*.html`,
    dist: `${ baseDist }/`
  }
};

gulp.task('clean', () => {
  return del(`${ baseDist }/*`);
});

gulp.task('styles', () => {
return gulp.src(dirs.sassPaths.src)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(gulp.dest(dirs.sassPaths.dist))
  .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
return gulp.src(dirs.scriptsPaths.src)
  .pipe(gulp.dest(dirs.scriptsPaths.dist))
  .pipe(browserSync.stream());
});


gulp.task('assets', () => {
return gulp.src(dirs.assetsPaths.src)
  .pipe(imagemin())
  .pipe(gulp.dest(dirs.assetsPaths.dist))
  .pipe(browserSync.stream());
});

gulp.task('html', () => {
return gulp.src(dirs.templatePaths.src)
  .pipe(nunjucks.compile())
  .pipe(gulp.dest(dirs.templatePaths.dist))
  .pipe(browserSync.stream());
});


gulp.task('serve', (done) => {
browserSync.init({
  server: baseDist,
}, done);
});

gulp.task('watch:sass', () => {
return gulp.watch(dirs.sassPaths.src, gulp.series('styles', (done) => {
  browserSync.reload();
  done();
}));
});

gulp.task('watch:scripts', () => {
return gulp.watch(dirs.scriptsPaths.src, gulp.series('scripts', (done) => {
  browserSync.reload();
  done();
}));
});

gulp.task('watch:assets', () => {
return gulp.watch(dirs.assetsPaths.src, gulp.series('assets', browserSync.reload));
});

gulp.task('watch:html', () => {
return gulp.watch(dirs.templatePaths.src, gulp.series('html', (done) => {
  browserSync.reload();
  done();
}));
});


gulp.task('watch', gulp.parallel('watch:html', 'watch:scripts', 'watch:sass', 'watch:assets'));

gulp.task('dev', gulp.series('clean', 'html', 'assets', 'styles', 'scripts', 'serve', 'watch'));
