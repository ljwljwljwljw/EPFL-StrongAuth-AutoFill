const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('AuthAPI', {
    saveData: (data) => ipcRenderer.invoke('saveData', data),
    deleteData: () => ipcRenderer.invoke('deleteData'),
    getTotpCode: () => ipcRenderer.invoke('getTotpCode')
})