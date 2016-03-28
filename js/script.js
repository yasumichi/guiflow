var $ = require("./js/jquery-2.1.4.min");
var fs = require("fs");
var ipcRenderer = require("electron").ipcRenderer;
var remote = require("remote");
var uiflow = remote.require("./app/uiflow");
require('ace-min-noconflict');
require('ace-min-noconflict/theme-monokai');

$(function() {
    ipcRenderer.on("openFile", function(e) {
        console.log(e);
    });
    ipcRenderer.on("saveFile", function(e) {
        console.log(e);
    });

});


$(function() {

    $(window).on("load resize", function() {
        $(".main").height($(window).height());
        var editor = ace.edit("text");
        editor.$blockScrolling = Infinity;
        editor.setTheme("ace/theme/monokai");
        setInterval(function() {
            uiflow.update("<anon>", editor.getValue(), "svg")
                .then(function(data) {
                    editor.getSession().setAnnotations([]);
                    $(".diagram-container").html(data);
                })
                .catch(function(err) {
                    var errorInfo = err.message.split(/:/g);
                    var fileName = errorInfo[0];
                    var line = errorInfo[1];
                    var text = errorInfo[3];
                    editor.getSession().setAnnotations([{
                        row: line,
                        type: "error",
                        text: text,
                    }]);
                    console.error(errorInfo);
                });

        }, 500);
    });
    var svgElement = function() {
        return $("svg");
    };
    var getViewBox = function(svg) {
        return svg[0].getAttribute("viewBox").split(/\s/g).map(parseFloat);
    };
    var setViewBox = function(svg, values) {
        var text = values.join(" ");
        svg[0].setAttribute("viewBox", text);
    };
    $("#plus").on("click", function() {
        var svg = svgElement();
        var viewBoxValues = getViewBox(svg);
        viewBoxValues[2] /= 1.2;
        viewBoxValues[3] /= 1.2;
        setViewBox(svg, viewBoxValues);
        console.log(viewBoxValues);
    });
    $("#minus").on("click", function() {
        var svg = svgElement();
        var viewBoxValues = getViewBox(svg);
        viewBoxValues[2] *= 1.2;
        viewBoxValues[3] *= 1.2;
        setViewBox(svg, viewBoxValues);
        console.log(viewBoxValues);
    });

    $(".diagram").on("load", function() {
        var svg = svgElement();
        var startX, startY;
        var onDrag = false;
        svg.on("mousedown", function(evt) {
            console.log(evt);
            startX = evt.clientX;
            startY = evt.clientY;
            onDrag = true;
            evt.preventDefault();
            return false;
        });
        svg.on("mousemove", function(evt) {
            if (onDrag) {
                console.log(onDrag);
                movingX = evt.clientX;
                movingY = evt.clientY;
                var diffX = movingX - startX;
                var diffY = movingY - startY;
                startX = movingX;
                startY = movingY;
                var viewBoxValues = getViewBox(svg);
                viewBoxValues[0] -= diffX * 1.4;
                viewBoxValues[1] -= diffY * 1.4;
                setViewBox(svg, viewBoxValues);
            }
            evt.preventDefault();
            return false;
        });
        svg.on("mouseup", function(evt) {
            onDrag = false;
            evt.preventDefault();
            return false;
        });

    });
});
