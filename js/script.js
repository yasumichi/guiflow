var $ = require("./js/jquery-2.1.4.min");
var ipcRenderer = require("electron").ipcRenderer;
var remote = require("remote");
var uiflow = remote.require("./app/uiflow");
var editor = require("./js/editor");
var diagram = require("./js/diagram");

ipcRenderer.on("openFile", function(e, v) {
    editor.open(v);
});
ipcRenderer.on("openNewFile", function(e, v) {
    editor.openNewFile(v);
});
ipcRenderer.on("openNewFileWithName", function(e, v) {
    editor.openNewFile(v);
});
ipcRenderer.on("saveFile", function(e) {
    console.log("save");
    editor.save();
});
ipcRenderer.on("saveFileWithName", function(e) {
    console.log(arguments);
    editor.save();
});

$(function() {
    $(window).on("load resize", function() {
        $(".main").height($(window).height());
    });
    editor.onChange(function(code) {
        uiflow.compile(code).then(function(data) {
                editor.clearError();
                return data;
            })
            .then(diagram.refresh)
            .catch(editor.setError);
    });
    diagram.on("page-click", function(lines) {
        editor.navigateTo(lines);
    });
    diagram.on("end-click", function(text) {
        editor.insert(text);
    });
});
