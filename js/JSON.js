const { ipcRenderer } = require("electron");

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

// Renderer process

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
/*
testAssignment = {
  points: 10,
  name: "harold's lunch",
  date: "2022-10-1",
  description: "Make his dang lunch",
};

createAssignment(testAssignment);

console.log(getAllAssignments());
*/

//TODO: assign html stuffs to actual json values
//html function to create an assignment based off the values in html assignment
function createAssignment() {
  ipcRenderer.invoke("createAssignment", obj).then((result) => {
    alert(result);
  });
}

// TODO: set
//html javascript function to get all assignments
function getAssignments() {
  ipcRenderer.invoke("getAllAssignments").then((result) => {
    alert(JSON.stringify(result));
  });
}
