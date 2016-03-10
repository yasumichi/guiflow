var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var mainWindow = null;


app.on('window-all-closed', function() {

    app.quit();
});

app.on('ready', function() {
    var builtMenu = Menu.buildFromTemplate([{
        label: app.getName(),
        submenu: [{
            label: 'guiflowについて'
        }, {
            label: '終了'
        }]
    }, {
        label: 'ファイル',
        submenu: [{
            label: '新規ファイルの作成'
        }, {
            label: 'Open'
        }, {
            label: "Export As.."
        }, ]
    }, {
        label: 'Edit',
        submenu: [{
            label: 'Complete Leaf'
        }]
    }, ]);
    Menu.setApplicationMenu(builtMenu);
    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        title: "guiflow"
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
