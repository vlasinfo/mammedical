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
import webpack from 'webpack-stream';
import { deleteAsync } from 'del';
import fileInclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';

const server = browserSync.create();
const isProd = process.env.NODE_ENV === 'production';
const mode = process.env.MODE || 'wp';

const assetsDest = mode === 'html' ? 'dist/assets/' : 'assets/';

const paths = {
  styles:  { src: 'src/scss/**/*.scss', main: 'src/scss/main.scss', dest: `${assetsDest}css/` },
  scripts: { src: 'src/js/**/*.js', entry: 'src/js/main.js', dest: `${assetsDest}js/` },
  images:  { src: 'src/img/**/*.{jpg,jpeg,png,svg,gif,avif,webp,ico,webmanifest}', dest: `${assetsDest}img/` },
  fonts:   { src: 'src/fonts/**/*', dest: `${assetsDest}fonts/` },
  html:    { src: 'src/html/*.html', watch: 'src/html/**/*.html', dest: 'dist/' },
  vendors: {
    css: [
      'node_modules/swiper/swiper-bundle.min.css'
    ],
    js: [
      'node_modules/swiper/swiper-bundle.js',
      'node_modules/gsap/dist/gsap.js',
      'node_modules/gsap/dist/ScrollTrigger.min.js',
      'node_modules/gsap/dist/CustomEase.min.js',
      'node_modules/gsap/dist/ScrollToPlugin.min.js',
      'node_modules/gsap/dist/SplitText.js',
      'node_modules/lenis/dist/lenis.min.js',
      'node_modules/pace-js/pace.min.js',
      'node_modules/snowflake/snowflake.min.js',
    ]
  }
};

// CLEAN
export function clean() {
  return deleteAsync([
    `${assetsDest}css/*`,
    `${assetsDest}js/*`,
    `${assetsDest}img/*`,
    `${assetsDest}fonts/*`,
    ...(mode === 'html' ? ['dist/*'] : [])
  ]);
}

// HTML (only for static mode)
export function html() {
  if (mode !== 'html') return Promise.resolve();
  return gulp.src(paths.html.src)
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulpIf(isProd, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(server.stream());
}

// STYLES
export function styles() {
  return gulp.src(paths.styles.main)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass({ includePaths: ['node_modules'], outputStyle: isProd ? 'compressed' : 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulpIf(!isProd, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// VENDORS CSS
export function vendorsCss() {
  if (!paths.vendors.css.length) return Promise.resolve();
  return gulp.src(paths.vendors.css)
    .pipe(concat('vendors.css'))
    .pipe(gulpIf(isProd, cleanCSS({ level: 2 })))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(server.stream());
}

// SCRIPTS (Webpack)
export function scripts() {
  return gulp.src(paths.scripts.entry)
    .pipe(webpack({
      mode: isProd ? 'production' : 'development',
      output: { filename: 'main.js' },
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'], cacheDirectory: true } }
        }]
      },
      resolve: { extensions: ['.js'] },
      devtool: isProd ? false : 'source-map'
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// VENDORS JS
export function vendorsJs() {
  return gulp.src(paths.vendors.js)
    .pipe(concat('vendors.js'))
    .pipe(gulpIf(isProd, terser()))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(server.stream());
}

// IMAGES
export function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest))
    .pipe(server.stream());
}

// FONTS
export function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(server.stream());
}

// SERVER
export function serve(done) {
  if (mode === 'wp') {
    server.init({
      proxy: 'http://parfumdeluxe.local',
      open: false,
      notify: false,
      port: 3000,
      injectChanges: true,
      files: ['**/*.php', 'assets/css/*.css', 'assets/js/*.js', 'assets/img/**/*']
    });
  } else {
    server.init({
      server: './dist',
      open: true,
      notify: false,
      port: 3000
    });
  }
  done();
}

// WATCH
function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.vendors.css, vendorsCss);
  gulp.watch(paths.vendors.js, vendorsJs);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);

  if (mode === 'html') gulp.watch(paths.html.watch, html);
  else gulp.watch(['**/*.php', '!node_modules/**']).on('change', server.reload);
}

// BUILD & DEV
export const build = gulp.series(clean, gulp.parallel(styles, scripts, vendorsCss, vendorsJs, images, fonts, html));
export const dev = gulp.series(build, gulp.parallel(serve, watchFiles));
export default dev;