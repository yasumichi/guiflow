var fs = require("fs");
var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var dialog = electron.dialog;
app.on('window-all-closed', function() {
    app.quit();
});

var mainMenu = {
    label: app.getName(),
    submenu: [{
        label: 'guiflowについて',
        accelerator: 'Cmd+Q',
        click: function() {
            alert("guiflow -version 0.01");
        }
    }, {
        label: '終了',
        accelerator: 'Cmd+Q',
        click: function() {
            app.quit();
        }
    }, {
        label: 'Toggle Full Screen',
        accelerator: 'Ctrl+Command+F',
        click: function() {
            var win = BrowserWindow.getFocusedWindow();
            if (win) {
                win.setFullScreen(!win.isFullScreen());
            }
        }
    }]
};
var fileMenu = {
    label: 'File',
    submenu: [{
        label: 'New File',
        click: function() {
            createWindow();
        },
    }, {
        label: 'Open...',
        click: function() {
            dialog.showOpenDialog({
                properties: ['openFile', 'openDirectory']
            }, function(fileNames) {
                createWindow(fileNames[0]);
            });
        },

    }, {
        label: "Save",
        click: function() {
            var win = BrowserWindow.getFocusedWindow();
            if (!win) {
                return;
            }
            win.webContents.send("saveFile");
        },
    }, {
        label: "Save As...",
        click: function() {
            var win = BrowserWindow.getFocusedWindow();
            if (!win) {
                return;
            }
            dialog.showSaveDialog({
                properties: ['openFile', 'openDirectory']
            }, function(fileNames) {
                win.webContents.send("saveFile", fileNames[0]);
            });

        },
    }]
};

var editMenu = {
    label: 'Edit',
    submenu: [{
        label: '未指定のページを補完'
    }]
};

var createWindow = function(fileName) {
    var mainWindow = null;
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        title: "guiflow -- " + (fileName ? fileName : "Untitled")
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    if (fileName) {
        setTimeout(function() {
            mainWindow.webContents.send("openFile", fileName);
        }, 1000);
    }
    mainWindow.toggleDevTools();

    return mainWindow;
};

app.on('ready', function() {
    var fileName = process.argv[2];
    //console.log(fileName);
    var builtMenu = Menu.buildFromTemplate([
        mainMenu, fileMenu, editMenu
    ]);
    Menu.setApplicationMenu(builtMenu);
    var firstWindow = createWindow(fileName);

});
