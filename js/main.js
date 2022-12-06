/**
 * @file main.js is the driver of the electron app with most of the functional data handlers
 * @author Pierce Heeschen, Max Lampa, and Tiernan
 */

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const ipcMain = require("electron").ipcMain;
const os = require("os");
//JSON Storage for electron
const storage = require("electron-json-storage");
const path = require("path");
const { resolve, format } = require("path");

//catch so that the electron reloader works without issue
try {
  require("electron-reloader")(module);
} catch {}

/**
 * @description default electron window creation
 */
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
  mainWindow.webContents.openDevTools()
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

// ipc of getAssignment for renderer
ipcMain.handle("getAssignment", async (event, id) => {
  const result = await getAssignment(id);
  return result;
});

// ipc of editassignment for renderer
ipcMain.handle("editAssignment", async (event, obj) => {
  const result = await editAssignment(obj);
  return result;
});

// ipc of createAssignment for renderer
ipcMain.handle("createTask", async (event, obj) => {
  const result = await createTask(obj);
  return result;
});

// ipc of getAllAssignments for renderer
ipcMain.handle("getAllTasks", async (event) => {
  const result = await getAllTasks();
  return result;
});

// ipc of deleteAssignment for renderer
ipcMain.handle("deleteAssignment", async (event, id) => {
  const result = await deleteAssignment(id);
  return result;
});

// ipc of deleteTask for renderer
ipcMain.handle("deleteTask", async (event, id) => {
  const result = await deleteTask(id);
  return result;
});

/**
 * @description create a new task in the system with incrementing task number
 * @todo not completed yet
 * @param {*} object of json task to be created
 * @returns none
 */
function createTask(task) {
  let key = "Tasks";

  storage.get(key, function (error, data) {
    //check to see if there are more than 0 assignments

    if (data != null && data.length > 0) {
      //set the new assignment id to the last assignment id + 1
      task.id = data[data.length - 1].id + 1;
      //push assignment onto the data array
      data.push(task);
      // replace the old data with the new data
      storage.set(key, data, function (error) {
        if (error) throw error;
      });
    } else {
      //if no assignments are in the array set the new assignment id to 0
      task.id = 0;
      // replace the old data with the new data
      storage.set(key, [task], function (error) {
        if (error) throw error;
      });
    }
  });
  return true;
}

/**
 * @description get task from json
 * @todo: not completed yet
 * @returns task that was gotten
 */
function getAllTasks() {
  try {
    //get assignments and return assignment array
    let tasks = storage.getSync("MOCK_DATA_TASKS");
    return tasks;
  } catch (error) {
    //return empty string if no assignments
    return "";
  }
}

/**
 * @description creates an assignment from the object passed in
 * @param {*} assignment pass in assignment to create the assignment
 * @returns true if assignment was sucessfully created
 */
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

/**
 * @description gets all the assignments that exist in the Assignments json
 * @returns returns array of assignments or empty string if none exist
 */
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

/**
 * @description gets an assignment by id
 * @param {*} id of the assignment that needs to be retrieved
 * @returns assignment that matches the id or null if not found
 */
// function to get assignment using the id of the assignment
function getAssignment(id) {
  let key = "Assignments";

  //grab the json information from the json with the key
  let tempObj = storage.getSync(key);
  //loop over all the items in the json array
  for (let i = 0; i < tempObj.length; i++) {
    //check to see if item in array is what we are looking for
    if (tempObj[i].id == id) {
      //return the json object in the json array with id = to input id
      return tempObj[i];
    }
  }

  //return null if not able to find the assignment
  return null;
}

/**
 * @todo testing to make sure everything works
 * @description edits an assignment by the object passed in
 * @param {*} obj passed in assignment
 * @return passed in assignment
 */
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

/**
 * @description delete an assignment by id
 * @param {*} id id of the assignment to delete
 */
function deleteAssignment(id) {
  let key = "Assignments";

  storage.get(key, function (error, data) {
    // iterate throughout the assignments array
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        // delete selected assignment by id
        data.splice(i, 1);
      }
    }
    //set the new data set with the new assignment name for the assignment by id
    storage.set(key, data, function (error) {
      if (error) throw error;
    });
  });
}

function deleteTask(id) {
  let key = "MOCK_DATA_TASKS";
  console.log(id);
  storage.get(key, function (error, data) {
    // iterate throughout the task array
    for (let i = 0; i < data.length; i++) {
      if (data[i].assignmentId == id) {
        // delete selected task by id
        data.splice(i, 1);
        i--;
      }
    }
    //set the new data set with the new task name for the task by id
    storage.set(key, data, function (error) {
      if (error) throw error;
    });
  });
}
/**
 * @todo testing to make sure everything works
 * @description edits a task by the object passed in
 * @param {*} obj passed in task
 * @return passed in task
 */
// edit tasks by passing in the object to replace from the json array
function editTask(obj) {
  let key = "Tasks";

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
          storage.set("Tasks", data, function (error) {
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
