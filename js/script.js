var $ = require("./js/jquery-2.1.4.min");
var ipcRenderer = require("electron").ipcRenderer;
var remote = require("remote");
var uiflow = remote.require("./app/uiflow");
var editor = require("./js/editor");
var diagram = require("./js/diagram");

[
    "open",
    "save",
    "saveAs",
    "undo",
    "redo",
    "cut",
    "copy",
    "paste",
    "selectAll"
].forEach(function(channel) {
    ipcRenderer.on(channel, editor[channel].listener(2));
});

var sendToEditor = function(channel) {
    return editor[channel];
};

var clipboard = require("clipboard");
var nativeImage = require("native-image");

var Menu = remote.require('menu');
var menu = Menu.buildFromTemplate([{
    label: "Undo",
    accelerator: 'CmdOrCtrl+Z',
    click: sendToEditor("undo"),
}, {
    label: "Redo",
    accelerator: 'CmdOrCtrl+Y',
    click: sendToEditor("redo"),
}, {
    type: 'separator'
}, {
    label: "Cut",
    accelerator: 'CmdOrCtrl+X',
    click: sendToEditor("cut"),
}, {
    label: "Copy",
    accelerator: 'CmdOrCtrl+C',
    click: sendToEditor("copy"),
}, {
    label: "Paste",
    accelerator: 'CmdOrCtrl+V',
    click: sendToEditor("paste"),
}, {
    label: "Select All",
    accelerator: 'CmdOrCtrl+A',
    click: sendToEditor("selectAll"),
}, ]);

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);

$(function() {
    $(window).on("load resize", function() {
        $(".main").height($(window).height());
    });
    $("#download").click(function(e) {
        editor.value.and(function(code) {
            return uiflow.base64png(code);
        }).and(function(base64) {
            var dataUri = "data:image/png;base64," + base64;
            var image = nativeImage.createFromDataURL(dataUri);
            clipboard.writeImage(image);
            alert("Copied Image to Clipboard");
        })();
    });

    editor.on("change", function(code) {
        uiflow.compile(code).then(function(data) {
                editor.clearError();
                return data;
            })
            .then(diagram.refresh)
            .catch(editor.setError);
    });
    editor.on("same", function(fileName) {
        document.title = "guiflow -- " + (fileName || "Untitled") + " = ";
    });
    editor.on("diff", function(fileName) {
        document.title = "guiflow -- " + (fileName || "Untitled") + " + ";
    });
    diagram.on("page-click", function(lines) {
        editor.navigateTo(lines);
    });
    diagram.on("end-click", function(text) {
        editor.insert(text);
    });
});
