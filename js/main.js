// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const ipcMain = require("electron").ipcMain;
const os = require("os");
//JSON Storage for electron
const storage = require("electron-json-storage");
const path = require("path");
// selenium stuffs
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const { resolve } = require("path");

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
  const result = await createAssignment(assignment);
  return result;
});

// get assignment call back to the renderer
ipcMain.handle("getAllAssignments", async (event) => {
  const result = await getAllAssignments();
  return result;
});

// ipc of getAssignmentById for renderer
ipcMain.handle("getAssignmentById", async (event, id) => {
  const result = await getAssignmentById(id);
  return result;
});

// ipc of editassignment for renderer
ipcMain.handle("editAssignment", async (event, obj) => {
  const result = await editAssignment(obj);
  return result;
});

// Javascript regular functions
// create assignment with input assignment object
function createAssignment(assignment) {
  let key = "Assignments";

  storage.get(key, function (error, data) {
    //check to see if there are more than 0 assignments

    if (data != null && data.length > 0) {
      //set the new assignment id to the last assignment id + 1
      assignment.id = data[data.length - 1].id + 1;
      //push assignment onto the data array
      data.push(assignment);
      // replace the old data with the new data
      storage.set(key, data, function (error) {
        if (error) throw error;
      });
    } else {
      //if no assignments are in the array set the new assignment id to 0
      assignment.id = 0;
      // replace the old data with the new data
      storage.set(key, [assignment], function (error) {
        if (error) throw error;
      });
    }
  });
  return true;
}

//  gets all the assignments that exist in the Assignments json
function getAllAssignments() {
  try {
    //get assignments and return assignment array
    let assns = storage.getSync("Assignments");
    return assns;
  } catch (error) {
    //return empty string if no assignments
    return "";
  }
}

// function to get assignment using the id of the assignment
function getAssignmentById(id) {
  //grab the json information from the json with the key
  let tempObj = storage.getSync(key);
  //loop over all the items in the json array
  for (let i = 0; i < tempObj.length; i++) {
    //check to see if item in array is what we are looking for
    if (tempObj.id[i] == id) {
      //return the json object in the json array with id = to input id
      return tempObj[i];
    }
  }

  //return null if not able to find the assignment
  return null;
}

// edit assignment name by the id of the assignment
function setAssignmentName(id, name) {
  let key = "Assignments";
  // grab the assignments to edit
  storage.get(key, function (error, data) {
    // iterate throughout the assignments array
    for (let i = 0; i < assignments.length; i++) {
      if (data[i].id == id) {
        data[i].name = name;
      }
    }
    //set the new data set with the new assignment name for the assignment by id
    storage.set(key, data, function (error) {
      if (error) throw error;
    });
  });
}

// edit assignments by passing in the object to replace from the json array
function editAssignment(obj) {
  let key = "Assignments";

  //get all of the assignments
  storage.get(key, function (error, data) {
    //check for no data
    if (data != null && data.length > 0) {
      //search through all of the data
      for (let i = 0; i < data.length; i++) {
        //look for specific id
        if (data[i].id == obj.id) {
          //set data index to object
          data[i] = obj;
          //replace the old data with the new data
          storage.set("Assignments", data, function (error) {
            if (error) throw error;
          });
          //return the object that was stored
          return obj;
        }
      }
    }
    //not able to get the assignment
    return null;
  });
}
