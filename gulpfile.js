const { src, dest, series, watch } = require('gulp');

const removeCommentsCss = require('gulp-strip-css-comments');
const autoprefixer      = require('gulp-autoprefixer');
const sass              = require('gulp-sass');
const cleanCSS          = require('gulp-clean-css');
const include           = require('gulp-file-include');
const del               = require('del');
const concat            = require('gulp-concat');
const htmlmin           = require("gulp-htmlmin");
const imagemin          = require("gulp-imagemin");
const webpack			= require("webpack-stream");
const sync              = require('browser-sync').create();


const htmlDev = () => {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(dest('app'));
};

const htmlBuild =() => {
	return src('src/**.html')
		.pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
        	collapseWhitespace: true,
        	removeComments: true,
        	removeEmptyAttributes: true,
        	removeRedundantAttributes: true,
        	removeScriptTypeAttributes: true,
        	removeStyleLinkTypeAttributes: true
        }))
        .pipe(dest('app'));
}


const imagesBuild = () => {
    return src("src/img/**/*")
        .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.mozjpeg({quality: 75, progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest("app/img"));
};

const imagesDev = () => {
	return src("src/img/**/*")
		.pipe(dest("app/img"));
}


const fonts = () => {
    return src("src/fonts/**/*")
        .pipe(dest("app/fonts"));
};


const scriptsDev = () => {
    return src("src/js/**/*")
        .pipe(dest("app/js"))
};

const scriptsBuild = () => {
    return src("src/js/**/*")
    	.pipe(webpack( require('./webpack.config.js') ))
        .pipe(dest("app/js"));
};

const scssDev = () => {
     return src('src/scss/**.scss')
        .pipe(sass({
            outputStyle:'expanded'
        }))
        .pipe(concat('css/style.css'))
        .pipe(autoprefixer())
        .pipe(dest('app'));
};

const scssBuild = () => {
     return src('src/scss/**.scss')
        .pipe(sass({
            outputStyle:'compressed'
            }))
        .pipe(concat('css/style.css'))
        .pipe(autoprefixer())
        .pipe(removeCommentsCss())
        .pipe(cleanCSS())
        .pipe(dest('app'));
};


const clear = () => {
    return del(['app', "dist"]);
};

const serve = () => {
    sync.init({
        server: './app/'
    });

    watch('src/**/**.html',             series(htmlDev)).on('change', sync.reload);
    watch("src/js/**/**.js",            series(scriptsDev)).on('change', sync.reload);
    watch('src/scss/**/**.scss',        series(scssDev)).on('change', sync.reload);
};

exports.build = series(clear, scssBuild, htmlBuild, scriptsBuild, fonts, imagesBuild);
exports.serve = series(clear, scssDev, htmlDev, scriptsDev, fonts, imagesDev, serve);
exports.clear = clear;
