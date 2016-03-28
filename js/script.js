var $ = require("./js/jquery-2.1.4.min");
var ipcRenderer = require("electron").ipcRenderer;
var remote = require("remote");
var uiflow = remote.require("./app/uiflow");
var editor = require("./js/editor");

ipcRenderer.on("openFile", function(e, v) {
    editor.open(v);
});
ipcRenderer.on("saveFile", function(e) {
    console.log(e);
});


$(function() {

    $(window).on("load resize", function() {
        $(".main").height($(window).height());
    });
    editor.onChange(function(code) {

        uiflow.update("<anon>", code, "svg")
            .then(editor.clearError)
            .then(function(data) {
                $(".diagram-container").html(data);
            })
            .then(function() {
                return uiflow.update("<anon>", code, "meta");
            })
            .then(refreshSVGEvent)
            .catch(editor.setError);
    });
    var svgElement = function() {
        return $("svg");
    };
    var getViewBox = function(svg) {
        return svg[0].getAttribute("viewBox").split(/\s/g).map(parseFloat);
    };
    var VIEW_BOX_VALUES;
    var SCALE = 2.0;
    var setViewBox = function(svg, values) {
        var text = values.join(" ");
        svg[0].setAttribute("viewBox", text);
        $("#viewBox").text(text);
        VIEW_BOX_VALUES = values;
    };
    $("#plus").on("click", function() {
        var svg = svgElement();
        var viewBoxValues = getViewBox(svg);
        viewBoxValues[2] /= 1.2;
        viewBoxValues[3] /= 1.2;
        setViewBox(svg, viewBoxValues);
    });
    $("#minus").on("click", function() {
        var svg = svgElement();
        var viewBoxValues = getViewBox(svg);
        viewBoxValues[2] *= 1.2;
        viewBoxValues[3] *= 1.2;
        setViewBox(svg, viewBoxValues);
    });

    var refreshSVGEvent = function(meta) {
        var metaData = JSON.parse(meta);
        var svg = svgElement();
        if (VIEW_BOX_VALUES)
            setViewBox(svg, VIEW_BOX_VALUES);
        var startX, startY;
        var initialViewBox;
        var onDrag = false;
        svg.find("g.node polygon").attr("fill", "white");
        svg.find("g.node ellipse").attr("fill", "white");
        svg.find("g.node").on("mouseover", function(e) {
            $(this).find("polygon").attr("stroke", "green");
            $(this).find("polygon").attr("stroke-width", "4");
            $(this).find("ellipse").attr("stroke", "red");
            $(this).find("ellipse").attr("stroke-width", "4");
        });
        svg.find("g.node").on("click", function(e) {
            var text = $(this).find("title").text();
            if (metaData[text]) {
                var lines = metaData[text].lines;
                editor.navigateTo(lines);
            } else {
                var insertText = ["\n[", text, "]\n"].join("");
                editor.insert(insertText);
            }

        });
        svg.find("g.node").on("mouseout", function(e) {
            $(this).find("polygon").attr("stroke", "black");
            $(this).find("polygon").attr("stroke-width", "1");
            $(this).find("ellipse").attr("stroke", "black");
            $(this).find("ellipse").attr("stroke-width", "1");
        });
        svg.on("mousedown", function(evt) {
            startX = evt.clientX;
            startY = evt.clientY;
            initialViewBox = getViewBox(svg);
            onDrag = true;
            evt.preventDefault();
            return false;
        });
        svg.on("mousemove", function(evt) {
            if (onDrag) {
                movingX = evt.clientX;
                movingY = evt.clientY;
                var diffX = movingX - startX;
                var diffY = movingY - startY;
                var viewBoxValues = getViewBox(svg);
                viewBoxValues[0] = initialViewBox[0] - diffX * SCALE;
                viewBoxValues[1] = initialViewBox[1] - diffY * SCALE;
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
    };
});
