const { app, BrowserWindow, BrowserView, ipcMain, clipboard } = require('electron')
const path = require('node:path')
const STORE = require('electron-store')
const TOTP = require('totp-generator')

const store = new STORE()

const createWindow = () => {

    const win = new BrowserWindow({
        width: 800,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

function decodeSecret(data) {
    const base32 = require('hi-base32')
    const payload = require(path.join(__dirname, "./MigrationPayload.js")).MigrationPayload
    const buffer = Buffer.from(data, 'base64')
    const msg = payload.decode(buffer)
    const obj = payload.toObject(msg)
    const secret = base32.encode(obj.otpParameters[0].secret)
    return secret
}

function genTotpCode(secret) {
    return TOTP(secret)
}

function copyToClipboard(text) {
    clipboard.writeText(text)
}

function saveData(event, data) {
        const secret = decodeSecret(data)
        store.set('secret', secret)
        const code = genTotpCode(secret)
        copyToClipboard(code)
        return code
}

function deleteData() {
    store.clear()
}

function getTotpCode() {
        if (!store.has('secret')) {
            return null
        }
        const secret = store.get('secret')
        const code = genTotpCode(secret)
        copyToClipboard(code)
        return code
}

app.whenReady().then(() => {
    ipcMain.handle('saveData', saveData)
    ipcMain.handle('getTotpCode', getTotpCode)
    ipcMain.handle('deleteData', deleteData)
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    app.quit()
    // if (process.platform !== 'darwin') {
    //     app.quit()
    // }
})