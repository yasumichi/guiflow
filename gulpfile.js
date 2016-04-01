var gulp = require('gulp');
var zip = require("gulp-zip");
var packager = require("electron-packager");

var electronVersion = "0.36.12";
var del = require('del');
gulp.task('clean', function(done) {
    del(['package'], function() {
        done();
    });
});

gulp.task('package', ['win32', 'darwin', 'linux'].map(function(platform) {
    var taskName = 'package:' + platform;
    var distDir = 'dist';
    gulp.task(taskName, function(done) {
        packager({
            dir: '.',
            name: '',
            arch: 'x64',
            platform: platform,
            out: 'package/' + platform,
            version: electronVersion,
            ignore: /package/,
            asar: true
        }, function(err) {
            done();
        });
    });
    return taskName;
}));
