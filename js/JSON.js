const { ipcRenderer } = require("electron");

// Function to delete an assignment based on the id of the assignment
// function deleteAssignment(id) {
//   let key = "Assignments";
//   currentArray = storage.get;
//   storage.get(key, function (error, data) {
//     //check to see if there are more than 0 assignments
//     if (data != null && data.length > 0) {
//       //pop the assignment at location of id
//       data.pop(id);
//       storage.set(key, data, function (error) {
//         if (error) throw error;
//       });
//     }
//   });
// }
// deleteAssignment(4);

// Renderer process

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

//html function to create an assignment based off the values in html assignment
function createAssignment(obj) {
  ipcRenderer.invoke("createAssignment", obj).then((result) => {
    return result;
  });
}

//html javascript function to get all assignments
function getAssignments() {
  ipcRenderer.invoke("getAllAssignments").then((result) => {
    return result;
  });
}

//html function to get an assignment by the id
function getAssignmentById(id) {
  ipcRenderer.invoke("getAssignmentById", id).then((result) => {
    return result;
  });
}

// opens html create assignment form
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

// clears data from create assignment form after submit or cancel
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementsByName("points")[0].value = "";
  document.getElementsByName("name")[0].value = "";
  document.getElementsByName("date")[0].value = "";
  document.getElementsByName("description")[0].value = "";
}

// submits assignment data and calls createAssignment function
function saveAssignment() {
  // declare assignment fields for html form
  var points = document.getElementsByName("points")[0].value;
  var name = document.getElementsByName("name")[0].value;
  var date = document.getElementsByName("date")[0].value;
  var description = document.getElementsByName("description")[0].value;

  // validation checks to see if fields have data
  if (points == null || points == "") {
    alert("Points can't be blank");
    return false;
  }
  if (name == null || name == "") {
    alert("Name can't be blank");
    return false;
  }
  if (date == null || date == "") {
    alert("Date can't be blank");
    return false;
  }
  if (description == null || description == "") {
    alert("Description can't be blank");
    return false;
  }

  // new assignment to be created in the json
  newAssignment = {
    points,
    date,
    name,
    description,
  };

  // create the actual assignment with the ipc
  createAssignment(newAssignment);

  // close the form of the new assignment
  closeForm();
}
