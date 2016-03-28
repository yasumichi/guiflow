var fs = require("fs");
var uiflow = require("uiflow");
var flumine = require("flumine");
var through2 = require("through2");

var api = module.exports = {};

api.update = function(inputFileName, code, format, outputFileName) {
    var f = flumine(function(d, ok, ng) {


        var buff = [];
        var output = through2(function(chunk, enc, cb) {
            var svg = chunk;
            buff.push(svg);
            cb();

        });

        var stream = uiflow.buildWithCode(
            inputFileName, code, format, function(error) {
                ng(error);
            });
        stream.pipe(output);
        stream.on("end", function() {
            console.log("build finished", format);
            ok(String(Buffer.concat(buff)));
            output.end();
        });


    });
    return f();
};
