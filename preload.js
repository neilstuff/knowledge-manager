const {
    contextBridge,
    ipcRenderer
} = require("electron");

const fs = require('fs');

contextBridge.exposeInMainWorld(
    "api", {
        quit: () => {
            ipcRenderer.send('quit');
        },
        maximize: () => {
            ipcRenderer.send('maximize');
        },
        unmaximize: () => {
            ipcRenderer.send('unmaximize');
        },
        minimize: () => {
            ipcRenderer.send('minimize');
        },
        isMaximized: () => {
            return ipcRenderer.sendSync('isMaximized');;
        },
        showOpenDialog: () => {
            return ipcRenderer.sendSync('showOpenDialog');
        },
        showSaveDialog: (filename) => {
            return ipcRenderer.sendSync('showSaveDialog', filename);
        },
        fs: () => {
            return fs
        },
        on: (message, callback) => {
            ipcRenderer.on(message, (event, path) => {
                callback()
            });
        },
        log: (message) => {
            console.log(message);
        }
    }
);