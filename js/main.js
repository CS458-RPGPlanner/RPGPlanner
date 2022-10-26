// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const ipcMain = require("electron").ipcMain;
const os = require("os");
//JSON Storage for electron
const storage = require("electron-json-storage");
const path = require("path");
// selenium stuffs
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      //recommended for allowing javascript execution with modules required
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// create assignment call back to the renderer
ipcMain.handle("createAssignment", async (event, assignment) => {
  const result = createAssignment(assignment);
  return result;
});

// get assignment call back to the renderer
ipcMain.handle("getAllAssignments", async (event) => {
  const result = getAllAssignments();
  return result;
});

//  gets all the assignments that exist in the Assignments json
function getAllAssignments() {
  try {
    let assns = storage.getSync("Assignments");
    //stringify to make readable
    return assns;
  } catch (error) {
    return "";
  }
}

function createAssignment(assignment) {
  let key = "Assignments";

  storage.get(key, function (error, data) {
    //check to see if there are more than 0 assignments

    if (data != null && data.length > 0) {
      //set the new assignment id to the last assignment id + 1
      assignment.id = data[data.length - 1].id + 1;
      data.push(assignment);
      storage.set(key, data, function (error) {
        if (error) throw error;
      });
    } else {
      //if no assignments are in the array set the new assignment id to 0
      assignment.id = 0;
      storage.set(key, [assignment], function (error) {
        if (error) throw error;
      });
    }
  });
  return true;
}
