// ================= IMPORTS =================
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
const sass = gulpSass(sassCompiler);

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
import notify from 'gulp-notify';
import mergeStream from 'merge-stream';

// Images
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import newer from 'gulp-newer';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

import os from 'os';
const isWindows = os.platform() === 'win32';

// ✅ Use require instead of top-level await
let sharpResponsive = null;
if (!isWindows) {
  try {
    sharpResponsive = require('gulp-sharp-responsive');
  } catch (err) {
    console.warn('gulp-sharp-responsive not available:', err.message);
  }
}

// ================= CONFIG =================
const server = browserSync.create();
const isProd = process.env.NODE_ENV === 'production';
const destFolder = isProd ? 'build' : 'dist';
const assetsDest = `${destFolder}/assets/`;

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    main: 'src/scss/main.scss',
    dest: `${assetsDest}css/`
  },
  scripts: {
    src: 'src/js/**/*.js',
    entry: 'src/js/main.js',
    dest: `${assetsDest}js/`
  },
  images: {
    src: 'src/img/**/*.{jpg,jpeg,png,svg,gif,avif,webp,ico,webmanifest}',
    dest: `${assetsDest}img/`
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: `${assetsDest}fonts/`
  },
  html: {
    src: 'src/html/*.html',
    watch: 'src/html/**/*.html',
    dest: `${destFolder}/`
  },
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

// ================= HELPERS =================
function handleError(taskName) {
  return plumber({
    errorHandler: notify.onError({
      title: `Task Failed [${taskName}]`,
      message: '<%= error.message %>'
    })
  });
}

// ================= CLEAN =================
export function clean() {
  return deleteAsync([`${destFolder}/**/*`]);
}

// ================= HTML =================
export function html() {
  return gulp.src(paths.html.src)
    .pipe(handleError('HTML'))
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
}

// ================= STYLES =================
export function styles() {
  return gulp.src(paths.styles.main, { sourcemaps: !isProd })
    .pipe(handleError('Styles'))
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass({ includePaths: ['node_modules'], outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// ================= SCRIPTS =================
function getWebpackConfig() {
  return {
    mode: isProd ? 'production' : 'development',
    output: { filename: 'main.js' },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-env'], cacheDirectory: true }
          }
        }
      ]
    },
    devtool: isProd ? false : 'source-map'
  };
}

export function scripts() {
  return gulp.src(paths.scripts.entry)
    .pipe(handleError('Scripts'))
    .pipe(webpackStream(getWebpackConfig(), webpack))
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// ================= VENDORS =================
export function vendorsCss() {
  return gulp.src(paths.vendors.css, { allowEmpty: true })
    .pipe(handleError('Vendors CSS'))
    .pipe(concat('vendors.css'))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

export function vendorsJs() {
  return gulp.src(paths.vendors.js, { allowEmpty: true })
    .pipe(handleError('Vendors JS'))
    .pipe(concat('vendors.js'))
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// ================= IMAGES =================
export function images() {
  const dest = paths.images.dest;

  const originals = gulp.src(paths.images.src)
    .pipe(handleError('Images'))
    .pipe(newer(dest))
    .pipe(gulpIf(isProd,
      imagemin([
        mozjpeg({ quality: 80 }),
        pngquant({ quality: [0.7, 0.85] }),
        imageminSvgo()
      ])
    ))
    .pipe(gulp.dest(dest));

  const responsive = (!isWindows && sharpResponsive) ? gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(handleError('Responsive Images'))
    .pipe(sharpResponsive({
      formats: [
        { width: 480, rename: { suffix: '-480' } },
        { width: 768, rename: { suffix: '-768' } },
        { width: 1120, rename: { suffix: '-1120' } }
      ]
    }))
    .pipe(gulp.dest(dest)) : null;

  const webpImages = gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(handleError('WebP'))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest(dest));

  const avifImages = gulp.src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(handleError('AVIF'))
    .pipe(avif({ quality: 45 }))
    .pipe(gulp.dest(dest));

  return mergeStream(
    originals,
    ...(responsive ? [responsive] : []),
    webpImages,
    avifImages
  );
}

// ================= FONTS =================
export function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(handleError('Fonts'))
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(server.stream());
}

// ================= SERVER =================
export function serve(done) {
  if (!isProd) {

    const nets = os.networkInterfaces();
    let localIP = 'localhost';

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          localIP = net.address;
        }
      }
    }

    server.init({
      server: `./${destFolder}`,
      host: '0.0.0.0', // 🔥 important
      port: 3000,
      open: true,
      notify: false
    });

    console.log(`\n📱 Open on mobile: http://${localIP}:3000\n`);
  }

  done();
}


// ================= WATCH =================
export function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts); 
  gulp.watch(paths.html.watch, html);
}

// ================= BUILD =================
export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, vendorsCss, vendorsJs, images, fonts, html)
);

// ================= DEV =================
export const dev = gulp.series(
  build,
  gulp.parallel(serve, watchFiles)
);

export default dev;
