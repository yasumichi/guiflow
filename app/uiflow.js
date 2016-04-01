var fs = require("fs");
var uiflow = require("uiflow");
var flumine = require("flumine");
var through2 = require("through2");

var api = module.exports = {};

api.update = function(inputFileName, code, format) {
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
            var buffAll = Buffer.concat(buff);
            ok(buffAll);
            output.end();
        });


    });
    return f();
};

var stringify = function(buff) {
    var str = String(buff);
    //console.log("stringify", str);
    return str;
};

var base64nize = function(buff) {
    return buff.toString("base64");
};
api.compile = function(code) {
    return flumine.set({
        svg: flumine.to(function(d) {
            return api.update("<anon>", code, "svg");
        }).to(stringify),
        meta: flumine.to(function(d) {
            return api.update("<anon>", code, "meta");
        }).to(stringify)
    })();
};

api.base64png = function(code) {
    return flumine.to(function() {
        return api.update("<anon>", code, "png");
    }).to(base64nize)();
};

api.changePath = function(path) {
    uiflow.DOT_PATH = path;
};

var spawn = require("child_process").spawn;

api.isEnablePath = flumine(function(path, ok, ng) {

    var child = spawn(path, ["-v"]);
    var r = "";
    child.on("error", function() {
        ok(false);
    });
    child.stderr.on("data", function(c) {
        r += String(c);
    });
    child.stderr.on("close", function() {
        if (r.match(/^dot -/)) {
            ok(true);
        } else {
            ok(false);
        }
    });
    setTimeout(function() {
        child.kill('SIGHUP');
    }, 50);

});
