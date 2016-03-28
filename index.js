var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

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
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }
    }]
};
var fileMenu = {
    label: 'ファイル',
    submenu: [{
        label: '新規ファイルの作成'
    }, {
        label: '別のファイルを開く'
    }, {
        label: "エクスポート"
    }, ]
};

var editMenu = {
    label: '編集',
    submenu: [{
        label: '未指定のページを補完'
    }]
};

var debugMenu = {
    label: 'デバッグ',
    submenu: [{
        label: 'リロード',
        accelerator: 'Command+R',
        click: function() {
            //mainWindow.restart();
        }

    }, {
        label: 'Toggle Developer Tools',
        accelerator: 'Alt+Command+I',
        click: function() {
            //mainWindow.toggleDevTools();
        }
    }, ]
};

var createWindow = function(fileName) {
    var mainWindow = null;
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        title: "guiflow"
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    if (fileName) {
        setTimeout(function() {
            mainWindow.webContents.send("openFile", fileName);
        }, 500);
    }
    mainWindow.toggleDevTools();

    return mainWindow;
};

app.on('ready', function() {
    var fileName = process.argv[2];
    //console.log(fileName);
    var builtMenu = Menu.buildFromTemplate([
        mainMenu, fileMenu, editMenu, debugMenu
    ]);
    Menu.setApplicationMenu(builtMenu);
    var firstWindow = createWindow(fileName);
});
