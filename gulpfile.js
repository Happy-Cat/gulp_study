//导入工具包 require('node_modules里对应模块')
// var gulp = require('gulp'), //本地安装gulp所用到的地方
//     less = require('gulp-less');
//
// //定义一个testLess任务（自定义任务名称）
// gulp.task('testLess', function () {
//     gulp.src('src/less/index.less') //该任务针对的文件
//         .pipe(less()) //该任务调用的模块
//         .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
// });
//
// gulp.task('default',['testLess', 'elseTask']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径
//-------------------------------------------------------------------------------------------------------------
    var gulp = require('gulp'),                                          //less转换css并监听
    less = require('gulp-less'),                                         //引入less
    livereload = require('gulp-livereload'),                             //引入实时监听
    autoprefixer = require('gulp-autoprefixer'),                         //根据设置浏览器版本自动处理浏览器前缀
    concat = require('gulp-concat'),                                     //合并javascript文件
    uglify = require('gulp-uglify'),                                     //压缩javascript文件
    rev = require('gulp-rev-append');                                    //添加版本号


gulp.task('less', function() {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});

//特别注意：若编译less的时候，同时执行其他操作，有可能引起页面刷新，而不是将样式植入页面
//例如下面任务同时生成sourcemap：
//var sourcemaps = require('gulp-sourcemaps');
//gulp.task('less', function () {
//    gulp.src(['src/less/*.less'])
//        .pipe(sourcemaps.init())
//        .pipe(less())
//        .pipe(sourcemaps.write('./'))
//        .pipe(gulp.dest('src/css'))
//        .pipe(livereload());
//});

//监听css变化
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('src/less/**/*.less', ['less']);
});

// 添加前缀
gulp.task('testAutoFx', function () {
    gulp.src('src/css/index.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest('dist/css'));
});

//合并js
gulp.task('testConcat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('all.js'))//合并后的文件名
        .pipe(gulp.dest('dist/js'));
});
//压缩js
gulp.task('jsmin', function () {
    //压缩src/js目录下的所有js文件
    //除了a1.js和a2.js（**匹配src/js的0个或多个子文件夹）
    gulp.src(['src/js/*.js', '!src/js/**/{a1,a2}.js'])
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist/js'));
});
//添加版本号
gulp.task('testRev', function () {
    gulp.src('index.html')
        .pipe(rev())
        .pipe(gulp.dest('dist/html'));
});