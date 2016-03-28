var $ = require("./jquery-2.1.4.min");
var fs = require("fs");
var EventEmitter = require('events');
var flumine = require("flumine");

require('ace-min-noconflict');
require('ace-min-noconflict/theme-monokai');

var editor;
$(window).on("load", function() {
    editor = ace.edit("text");
    editor.$blockScrolling = Infinity;
    editor.setTheme("ace/theme/monokai");
});

var waitEditorReady = flumine(function(d, ok, ng) {
    if (editor) {
        ok(d);
    } else {
        var id = setInterval(function() {
            if (editor) {
                clearInterval(id);
                ok(d);
            }
        }, 200);
    }
});
var EDITOR_FILE_NAME;
module.exports = {
    open: waitEditorReady.and(function(fileName, ok, ng) {
        EDITOR_FILE_NAME = fileName;
        fs.readFile(fileName, function(err, cont) {
            if (err) {
                ng(err);
            } else {
                editor.setValue(String(cont));
                ok(cont);
            }
        });
    }),
    openNewFile: waitEditorReady.and(function() {}),
    openNewFileWithName: waitEditorReady.and(function() {}),
    save: waitEditorReady.and(function(d, ok, ng) {
        var code = editor.getValue();
        fs.writeFile(EDITOR_FILE_NAME, code, function(err) {
            if (err)
                return ng(err);
            return ok();
        });
    }),
    saveFileWithName: waitEditorReady.and(function() {}),

    value: waitEditorReady.and(function() {
        return editor.getValue();
    }),
    setError: waitEditorReady.and(function(err) {
        var errorInfo = err.message.split(/:/g);
        var fileName = errorInfo[0];
        var line = errorInfo[1];
        var text = errorInfo[3] + errorInfo[4];
        editor.getSession().setAnnotations([{
            row: line,
            type: "error",
            text: text,
        }]);
    }),
    clearError: waitEditorReady.through(function() {
        editor.getSession().setAnnotations([]);
    }),
    navigateTo: waitEditorReady.through(function(d) {
        editor.navigateTo(d, 0);
        editor.focus();
        editor.scrollToLine(d, true, true);
    }),
    insert: waitEditorReady.through(function(d) {
        editor.setValue(editor.getValue() + d);
    }),
    onChange: function(cb) {
        waitEditorReady().then(function() {
            var PREV = editor.getValue();
            setInterval(function() {
                now = editor.getValue();
                if (PREV !== now) {
                    PREV = now;
                    cb(now);
                }
            }, 500);

        });
    },
};
