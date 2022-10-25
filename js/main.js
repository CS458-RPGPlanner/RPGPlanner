// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const os = require("os");
//JSON Storage for electron
const storage = require("electron-json-storage");
const path = require("path");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

/**
 * JSON SCHEMA - ASSIGNMENTS
 * id: int
 * name: STRING
 * date: STRING
 * points: INT
 * description: STRING
 *
 * JSON SCHEMA - TASKS
 * assnId: int
 * id: int
 * name: STRING
 * date: STRING
 * points: INT
 * description: STRING
 *
 */

// Function to delete an assignment based on the id of the assignment
function deleteAssignment(id) {
  let key = "Assignments";
  currentArray = storage.get;
}

// Function to create an assignment in JSON and return true upon successful creation
function createAssignment(assignment) {
  //create the assignment in the json array of assignments
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
  // TODO: double check to make sure it's not always returning true
  return "true";
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
  let assignments = storage.getSync(key);
  // iterate throughout the assignments array
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].id == id) {
      assignments[i].name = name;
    }
  }
  //set the new data set with the new assignment name for the assignment by id
  storage.set(key, assignments, function (error) {
    if (error) throw error;
  });
}

// edit assignment description by the id of the assignment
function setAssignmentDescription(id, description) {
  let key = "Assignments";
  // grab the assignments to edit
  let assignments = storage.getSync(key);
  // iterate throughout the assignments array
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].id == id) {
      assignments[i].description = description;
    }
  }
  // set the new data set with the new assignment description for the assignment by id
  storage.set(key, assignments, function (error) {
    if (error) throw error;
  });
}

// edit assignment points by the id of the assignment
function setAssignmentPoints(id, points) {
  let key = "Assignments";
  // grab the assignments to edit
  let assignments = storage.getSync(key);
  // iterate throughout the assignments array
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].id == id) {
      assignments[i].points = points;
    }
  }
  //set the new data set with the new assignment points for the assignment by id
  storage.set(key, assignments, function (error) {
    if (error) throw error;
  });
}

// edit assignment date by the id of the assignment
function setAssignmentDate(id, date) {
  let key = "Assignments";
  // grab the assignments to edit
  let assignments = storage.getSync(key);
  // iterate throughout the assignments array
  for (let i = 0; i < assignments.length; i++) {
    if (assignments[i].id == id) {
      assignments[i].date = date;
    }
  }
  //set the new data set with the new assignment date for the assignment by id
  storage.set(key, assignments, function (error) {
    if (error) throw error;
  });
}

//  gets all the assignments that exist in the Assignments json
function getAllAssignments() {
  try {
    let assns = storage.getSync("Assignments");
    return assns;
  } catch (error) {
    return "";
  }
}

function createTask(key, object) {
  //check to make sure task doesn't already exist returns null obj if doesn't exist
  //if object doesn't exist in the json create a new task in JSON
  storage.set(key, object, function (error) {
    if (error) return "false";
  });

  return "true";
}

// function to read tasks in JSON
function getTask(key, name) {
  //grab the json information from the json with the key
  let taskObj = storage.getSync(key);
  for (let i = 0; i < taskObj.length; i++) {
    if (taskObj[i].name == name) {
      return taskObj[i];
    }
  }

  return null;
}

taskObj = [{ name: "Aquire land", date: "2/3/1306" }];

//Task Testing
//taskBooleanVal = createTask('Tasks', taskObj);
//getTaskObj = getTask('Tasks', "Aquire land")

//console.log(taskBooleanVal);
//console.log(getTaskObj);

//Assignment testing
console.log(getAllAssignments());
