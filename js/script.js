var $ = require("./js/jquery-2.1.4.min");
var fs = require("fs");
var remote = require("remote");
var uiflow = remote.require("./app/uiflow");
require('ace-min-noconflict');
require('ace-min-noconflict/theme-monokai');


/*
window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);*/
$(function() {

    $(window).on("load resize", function() {
        $(".container").height($(window).height());
        var editor = ace.edit("text");
        editor.$blockScrolling = Infinity;
        editor.setTheme("ace/theme/monokai");
        setInterval(function() {
            uiflow.update("<anon>", editor.getValue(), "svg", "tmp.svg")
                .catch(function(err) {
                    console.error(err);
                })
                .then(function() {
                    $("#diagram").attr("data", "tmp.svg?" + Date.now());
                });
        }, 500);
    });
    var svgElement = function() {
        var svgDoc = document.getElementById('diagram').contentDocument;
        return $(svgDoc).find('svg');
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
    $("#diagram").on("load", function() {
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
