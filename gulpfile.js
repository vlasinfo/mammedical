// gulpfile.js
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);

import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import gulpIf from 'gulp-if';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import { deleteAsync } from 'del';
import fileInclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import mergeStream from 'merge-stream';

// Images
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

const server = browserSync.create();
const isProd = process.env.NODE_ENV === 'production';
const destFolder = isProd ? 'build' : 'dist';
const assetsDest = `${destFolder}/assets/`;

const paths = {
  styles:  { src: 'src/scss/**/*.scss', main: 'src/scss/main.scss', dest: `${assetsDest}css/` },
  scripts: { src: 'src/js/**/*.js', entry: 'src/js/main.js', dest: `${assetsDest}js/` },
  images:  { src: 'src/img/**/*.{jpg,jpeg,png,svg,gif,avif,webp,ico,webmanifest}', dest: `${assetsDest}img/` },
  fonts:   { src: 'src/fonts/**/*', dest: `${assetsDest}fonts/` },
  html:    { src: 'src/html/*.html', watch: 'src/html/**/*.html', dest: `${destFolder}/` },
  vendors: {
    css: ['node_modules/swiper/swiper-bundle.min.css'],
    js: [
      'node_modules/swiper/swiper-bundle.js',
      'node_modules/gsap/dist/gsap.js',
      'node_modules/gsap/dist/ScrollTrigger.min.js',
      'node_modules/gsap/dist/CustomEase.min.js',
      'node_modules/gsap/dist/ScrollToPlugin.min.js',
      'node_modules/gsap/dist/SplitText.js',
      'node_modules/lenis/dist/lenis.min.js',
      'node_modules/pace-js/pace.min.js',
      'src/js/custom-libs/split-type.min.js',
      'src/js/custom-libs/snowflake.min.js'
    ]
  }
};

// ================= CLEAN =================
export function clean() {
  return deleteAsync([`${destFolder}/**/*`], { force: true });
}

// ================= HTML =================
export function html() {
  return gulp.src(paths.html.src)
    .pipe(plumber())
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
}

// ================= STYLES =================
export function styles() {
  return gulp.src(paths.styles.main, { sourcemaps: !isProd })
    .pipe(plumber())
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass({ includePaths: ['node_modules'], outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// ================= VENDORS CSS =================
export function vendorsCss() {
  if (!paths.vendors.css || !paths.vendors.css.length) return Promise.resolve();
  return gulp.src(paths.vendors.css, { allowEmpty: true })
    .pipe(plumber())
    .pipe(concat('vendors.css'))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// ================= SCRIPTS =================
export function scripts() {
  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    output: { filename: 'main.js' },
    module: {
      rules: [{
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'], cacheDirectory: true }
        }
      }]
    },
    devtool: isProd ? false : 'source-map'
  };

  return gulp.src(paths.scripts.entry, { allowEmpty: true })
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.reload({ stream: true }));
}

// ================= VENDORS JS =================
export function vendorsJs() {
  if (!paths.vendors.js || !paths.vendors.js.length) return Promise.resolve();
  return gulp.src(paths.vendors.js, { allowEmpty: true })
    .pipe(plumber())
    .pipe(concat('vendors.js'))
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.reload({ stream: true }));
}

// ================= IMAGES =================
export function images() {
  const dest = paths.images.dest;

  const originals = gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(newer(dest))
    .pipe(gulpIf(isProd, imagemin([
      mozjpeg({ quality: 80, progressive: true }),
      pngquant({ quality: [0.7, 0.85] }),
      imageminSvgo({ plugins: [{ name: 'removeViewBox', active: false }] })
    ])))
    .pipe(gulp.dest(dest));

  const toWebp = gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(plumber())
    .pipe(newer({ dest, ext: '.webp' }))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest(dest));

  const toAvif = gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(plumber())
    .pipe(newer({ dest, ext: '.avif' }))
    .pipe(avif({ quality: 45 }))
    .pipe(gulp.dest(dest));

  return mergeStream(originals, toWebp, toAvif);
}

// ================= FONTS =================
export function fonts() {
  return gulp.src(paths.fonts.src, { allowEmpty: true })
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(server.stream());
}

// ================= SERVER =================
export function serve(done) {
  if (!isProd) {
    server.init({
      server: `./${destFolder}`,
      open: true,
      notify: false,
      port: 3000
    });
  }
  done();
}

// ================= WATCH =================
export function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  if (paths.vendors.css.length) gulp.watch(paths.vendors.css, vendorsCss);
  gulp.watch(paths.scripts.src, scripts);
  if (paths.vendors.js.length) gulp.watch(paths.vendors.js, vendorsJs);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.html.watch, html);
}

// ================= BUILD & DEV =================
export const build = gulp.series(
  clean,
  gulp.parallel(styles, vendorsCss, scripts, vendorsJs, images, fonts, html)
);

export const dev = gulp.series(build, gulp.parallel(serve, watchFiles));
export default dev;
