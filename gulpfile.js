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
<<<<<<< HEAD
<<<<<<< HEAD
        out: 'package/',
=======
        out: 'package/' + platform,
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
=======
        out: 'package/' + platform,
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
        version: electronVersion,
        icon: "icon/guiflow.ico",
        ignore: "/package($|/)",
        asar: true,
    }, function(err) {
        if (err) {
            console.error(err);
        }
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
<<<<<<< HEAD
<<<<<<< HEAD
        out: 'package/',
=======
        out: 'package/' + platform,
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
=======
        out: 'package/' + platform,
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
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
<<<<<<< HEAD
<<<<<<< HEAD
        out: 'package/',
        version: electronVersion,
        ignore: "/package($|/)",
        icon: "icon/gui_flow_icon.icons",
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
=======
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
=======
>>>>>>> 075862538e77e9088747a97e5d80a9295dbc307d
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
