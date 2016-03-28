var fs = require("fs");
var uiflow = require("uiflow");
var flumine = require("flumine");
var through2 = require("through2");
var prebuild = "";

var api = module.exports = {};

api.update = function(inputFileName, code, format, outputFileName) {
    var f = flumine(function(d, ok, ng) {
        if (code == prebuild) {
            return;
        }
        prebuild = code;
        /*var output = fs.createWriteStream(outputFileName, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            autoClose: true
        });*/

        var output = through2(function(chunk, enc, cb) {
            var svg = String(chunk);
            console.log(svg);
            ok(svg);
            this.end();
        });
        var stream = uiflow.buildWithCode(
            inputFileName, code, format, function(error) {
                ng(error);
            }).pipe(output);

    });
    return f();
};
