"use strict";

const gulp                 = require('gulp');
const {series, parallel}   = require('gulp'); // Подключаем Gulp
const plumber              = require("gulp-plumber");
const sass                 = require('gulp-sass'); //Подключаем Sass пакет,
const browserSync          = require('browser-sync').create(); // Подключаем Browser Sync
const concat               = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
const autoprefixer         = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
const cleanCSS             = require('gulp-clean-css'); // Подключаем пакет для минификации CSS
const rename               = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
const uglify               = require('gulp-uglify'); // Подключаем gulp-uglifyjs (для сжатия JS)
const del                  = require('del'); // Подключаем библиотеку для удаления файлов и папок
const imagemin             = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
const pngquant             = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
const cache                = require('gulp-cache'); // Подключаем библиотеку кеширования
const pug                  = require('gulp-pug');
const eslint               = require('gulp-eslint');

//Порядок подключения css файлов
var cssFiles = [
   // 'src/fonts/iconfont/material-icons.css', //плагин
   'src/slick/slick/slick.css', //плагин
   'src/slick/slick/slick-theme.css', //плагин
   // 'src/chosen/chosen.min.css', //плагин
   'src/css/styles.css'
]
//Порядок подключения js библиотек
var jsLibs = [
   'src/js-files/jquery-3.5.0.min.js',
   'src/slick/slick/slick.min.js'
  
   // 'src/chosen/chosen.jquery.min.js'
]
//Порядок подключения js файлов
var jsFiles = [
   // 'src/js-files/buttons.js',
   'src/js-files/menu-icon.js',
   'src/js-files/slick.js',
   'src/js-files/index.js'
   // 'src/js-files/formDayRate.js',
   // 'src/js-files/chosenSelect.js',
   // 'src/js-files/formEmployees.js',
   // 'src/js-files/map.js',
   // 'src/js-files/link-icons.js'
]

//Прочие необходимые файлы, перенос в build
var OtherFiles = [
   // 'src/chosen/*.png',
   '*.+(ico|php)'
]


//Таск на стили SCSS
function scss() {
   return gulp.src('src/scss-files/*.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
      .pipe(gulp.dest('src/css'));
}

//Таск на стили CSS
function styles() {
   return gulp.src(cssFiles)
      .pipe(concat('styles.css'))//Объединение файлов в один
      .pipe(autoprefixer({
         overrideBrowserslist: ['last 2 versions'],
         cascade: false
      })) //Добавить префиксы
      .pipe(cleanCSS({
         level: 2
      })) //Минификация CSS
      .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
}

//Таск на скрипты JS
function scripts() {
   return gulp.src(jsFiles)
      .pipe(plumber())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .pipe(concat('script.js')) //Объединение файлов в один
      .pipe(uglify({
         toplevel: true
      })) //Минификация JS
      .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
}

//Таск на библиотеки JS
function libs() {
   return gulp.src(jsLibs)
      .pipe(plumber())
      .pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
      .pipe(uglify({
         toplevel: true
      })) //Минификация JS
      .pipe(concat('libs.js')) //Объединение файлов в один
      .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
      .pipe(gulp.dest('./build'))
}

//Таск на скрипты PUG
function pugFiles() {
   return gulp.src('src/pug-files/index.pug')
   .pipe(pug({
      pretty: true
    }))
   .pipe(gulp.dest('./build'))
   .pipe(browserSync.stream());
 }

//Удалить всё в указанной папке
function clean() {
   return del(["build/*"]);
 }

 // BrowserSync
function browserSyncFunction(done) {
   browserSync.init({
     server: {
       baseDir: "./build"
     },
     notify: false
   });
   done();
}
 
//BrowserSync Reload
function browserSyncReload(done) {
   browserSync.reload();
   done();
}

// Watch files
function watchFiles() {
   gulp.watch('./src/scss-files/**/*.scss', gulp.series(scss, styles, browserSyncReload));
   gulp.watch('./src/pug-files/**/*.pug', gulp.series(pugFiles, browserSyncReload));
   gulp.watch('./src/js-files/**/*.js', gulp.series(scripts, browserSyncReload));
   gulp.watch('./src/img/**/*', gulp.series(img, browserSyncReload));
 }

function img() {
	return gulp.src('src/img/**/*') // Берем все изображения
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
      .pipe(gulp.dest('build/img')) // Выгружаем на продакшен
      .pipe(browserSync.stream());
}

// Переносим шрифты в продакшен
function fonts() {
	return gulp.src('src/fonts/**/*') 
	   .pipe(gulp.dest('build/fonts'));
}

// Переносим прочее в продакшен
function files() {
   return gulp.src(OtherFiles)
      .pipe(gulp.dest('build'));
}

// define complex tasks
exports.watch = series(browserSyncFunction, watchFiles);
exports.build = series(clean, parallel(libs, scripts, fonts, files, img, scss), pugFiles, styles);


// export tasks
exports.img = img;
exports.scss = scss;
exports.clean = clean;
exports.libs = libs;
exports.fonts = fonts;
exports.pugFiles = pugFiles;
exports.scripts = scripts;
exports.styles = styles;
exports.files = files;
