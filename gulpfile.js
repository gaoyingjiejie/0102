var gulp = require('gulp'); //引入gulp
var sass = require('gulp-sass') //编译sass
var webserver = require('gulp-webserver') //起服务

var clean = require('gulp-clean-css') //压缩css
var uglify = require('gulp-uglify') //压缩js
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var fs = require('fs')
var url = require('url')
var path = require('path')
    //编译sass
gulp.task('css', function() {
        return gulp.src('./src/scss/index.scss')
            .pipe(sass())
            .pipe(gulp.dest('./src/css'))
    })
    //监听sass
gulp.task('watch', function() {
        return gulp.watch('./src/scss/index.scss', gulp.series('css'))
    })
    //起服务
gulp.task('webserver', function() {
    return gulp.src('src')
        .pipe(webserver({
            port: 7000, //端口号
            open: true, //自动打开
            livereload: true, //自动刷新
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    res.end('')
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }

            }
        }))

})

gulp.task('dev', gulp.series('css', 'webserver', 'watch'))
    //压缩js
gulp.task('uglify', function() {
        return gulp.src('./src/js/index.js')
            .pipe(babel({
                presets: 'es2015'
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./build/js/'))
    })
    //压缩css
gulp.task('clean', function() {
        return gulp.src('./src/css/index.css')

        .pipe(clean())
            .pipe(gulp.dest('./build/css/'))
    })
    //合并文件
gulp.task('concat', function() {
        return gulp.src('./src/js/*.js')

        .pipe(concat('all.js'))
            .pipe(gulp.dest('./build/js/'))
    })
    //线上环境
gulp.task('build', gulp.series('clean', 'uglify', 'concat'))