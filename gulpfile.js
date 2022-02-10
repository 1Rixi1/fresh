const {
  src,
  dest,
  watch,
  parallel,
  series,
} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
const ssi = require('browsersync-ssi');
const buildssi = require('gulp-ssi');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const htmlInclude = require('gulp-file-include');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');


function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/',
      middleware: ssi({ baseDir: 'app/', ext: '.html' }),
    },
    // tunnel: 'yousitename',
    notify: false,
  });
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true,
    }))
    .pipe(dest('dist/css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/swiper/swiper-bundle.js',
      'node_modules/mixitup/dist/mixitup.js',
      'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
      'node_modules/fslightbox/index.js',
      'node_modules/rateyo/src/jquery.rateyo.js',
      'app/js/main.js',
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/images/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: true
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ]))
    .pipe(dest('dist/images'));
}

function svgSprites() {
  return src('app/images/icons/**/**.svg')

    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "sprite.svg",
          example: true
        }
      }
    }))

    .pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
    
    .pipe(dest('app/images'));

}

function includes() {
  return src(['app/components/**/*.html'])
    .pipe(htmlInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('app'))
  .pipe(browserSync.stream());
}

function otfToTtf() {
  return src('app/fonts/*.otf')
  .pipe(fonter({
    formats: ['ttf']
  }))
  .pipe(dest('app/fonts'))
}

function ttfToWoff() {
  return src('app/fonts/*.ttf')
  .pipe(fonter({
    formats: ['woff']
  }))
  .pipe(dest('app/fonts'))
  .pipe(src('app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('app/fonts'));
}

function cleanDist() {
  return del('dist');
}

function build() {
  return src([
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/fonts/*'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'));
}

function buildhtml() {
  return src(['app/**/*.html', '!app/parts/**/*'])
  .pipe(buildssi({ root: 'app/' }))
  .pipe(dest('dist'));
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
  watch(['app/images/icons/**/**.svg'], svgSprites);
  watch(['app/components/**/*.html'], includes);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.cleanDist = cleanDist;
exports.svgSprites = svgSprites;
exports.includes = includes;
exports.buildhtml = buildhtml;
exports.otfToTtf = otfToTtf;
exports.ttfToWoff = ttfToWoff;

exports.fonts = parallel(otfToTtf, ttfToWoff);

exports.build = series(cleanDist, parallel(otfToTtf, ttfToWoff), images, build, buildhtml);


exports.default = parallel(includes, styles, scripts, svgSprites, browsersync, watching);  