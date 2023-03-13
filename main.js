const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require("path");
const WeatherAPI = require(path.join(__dirname, "api.js"));

const loadMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "test.html"));
  mainWindow.webContents.openDevTools();
  ipcMain.on('close', () => {
    app.quit();
  })

  ipcMain.on('GetData', (event, cityname) => {
    console.log("search:" + cityname);
    api.getDB().all("SELECT * FROM weather WHERE cityname = '" + cityname + "'", (err, row)=>{
      mainWindow.webContents.send("ShowDetail", row);
    });
  });
}

app.on("ready", loadMainWindow);
var api = new WeatherAPI();
/*
// select all rows from the table
db.all('SELECT cityname FROM weather;', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    // print the value of the "column_name" column
    console.log(row.cityname);
  });
});
*/

// close the database connection