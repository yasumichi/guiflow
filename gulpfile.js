var gulp = require('gulp');
var zip = require("gulp-zip");
var runseq = require("run-sequence");
var packager = require("electron-packager");

var electronVersion = "0.36.12";
var del = require('del');
gulp.task('clean', function(done) {
    return del(['package'], function() {
        done();
    });
});

gulp.task("package:win32", function(done) {
    var platform = "win32";
    return packager({
        dir: '.',
        name: '',
        arch: 'x64',
        platform: platform,
        out: 'package/' + platform,
        version: electronVersion,
        icon: "icon/guiflow.ico",
        ignore: "/package($|/)",
        asar: true,
    }, function(err) {
        done();
    });
});

gulp.task("package:linux", function(done) {
    var platform = "linux";
    return packager({
        dir: '.',
        name: '',
        arch: 'x64',
        platform: platform,
        out: 'package/' + platform,
        version: electronVersion,
        ignore: "/package($|/)",
        asar: true,
    }, function(err) {
        done();
    });
});


gulp.task("package:darwin", function(done) {
    var platform = "darwin";
    return packager({
        dir: '.',
        name: '',
        arch: 'x64',
        platform: platform,
        out: 'package/' + platform,
        version: electronVersion,
        ignore: "/package($|/)",
        icon: "icon/gui_flow_icon.icons",
        asar: true,
    }, function(err) {
        done();
    });
});
gulp.task('package', function(cb) {
    runseq(
        'clean', [
            'package:win32',
            'package:darwin',
            'package:linux'
        ], cb);
});
