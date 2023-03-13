const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    close: () => ipcRenderer.send('close'),
    getData: (cityname) => ipcRenderer.send('getData', cityname)
});