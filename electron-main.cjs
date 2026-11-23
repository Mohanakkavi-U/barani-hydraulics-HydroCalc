// Main process for Electron
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'), // Optional: update if you have a better icon
  });

  // Load the React build
  // Use app.isPackaged and process.resourcesPath for correct dist/index.html path
  let indexPath;
  if (app.isPackaged) {
    indexPath = path.join(process.resourcesPath, 'dist', 'index.html');
  } else {
    indexPath = path.join(__dirname, 'dist', 'index.html');
  }
  const fileUrl = 'file://' + indexPath.replace(/\\/g, '/');
  console.log('Attempting to load index.html from:', fileUrl);
  win.loadURL(encodeURI(fileUrl)).catch((err) => {
    console.error('Failed to load index.html:', err);
  });

  // Only open devtools in development
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  // Log console errors from the renderer
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer console [${level}]: ${message} (${sourceId}:${line})`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
