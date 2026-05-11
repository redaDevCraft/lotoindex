const { app, BrowserWindow } = require('electron')

const waitForVite = async() => {
    const url = 'http://localhost:5173/'

    while (true) {
        try {
            await fetch(url)
            return url
        } catch {
            await new Promise(r => setTimeout(r, 300))
        }
    }
}

app.whenReady().then(async() => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    })

    const url = await waitForVite()
    win.loadURL(url)
})