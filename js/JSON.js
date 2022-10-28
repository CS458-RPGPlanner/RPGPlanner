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

//html function to create an assignment based off the values in html assignment
async function createAssignment(obj) {
  let result = await ipcRenderer.invoke("createAssignment", obj);
  //return promise value after waiting
  return result;
}

//html javascript function to get all assignments
async function getAssignments() {
  //return promise value after waiting
  let result = await ipcRenderer.invoke("getAllAssignments");
  return result;
}

//html function to get an assignment by the id
async function getAssignmentById(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("getAssignmentById", id);
  return result;
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

  // display the new assignment
  displayNewAssignment(newAssignment);

  // close the form of the new assignment
  closeForm();
}

//declared as async function so that race conditions don't apply for assignment retrieval
// displays all currently saved assignments
async function displayAssignments() {
  // creates an array of the saved assignments
  let assignments = await getAssignments();
  //testing to make sure that assignments are loaded correctly
  //alert(assignments[0]);

  var parent = document.getElementById("accordion");

  //iterates through the array and creates needed HTML elements for each of the assignments
  for (let i = 0; i < assignments.length; i++) {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("id", "assignment-" + assignments[i].id);

    let cardHeader = document.createElement("div");
    cardHeader.setAttribute("class", "card-header");
    cardHeader.setAttribute("id", "assnHeader-" + assignments[i].id);

    let assign = document.createElement("button");
    assign.setAttribute("onclick", "toggleButton();");
    assign.setAttribute("class", "defaultBtn");
    assign.setAttribute("data-toggle", "collapse");
    assign.setAttribute("href", "#description-" + assignments[i].id);

    let assignName = document.createElement("p");
    assignName.setAttribute("class", "assignment-name");
    assignName.innerHTML = assignments[i].name;

    let dueTasks = document.createElement("div");
    dueTasks.setAttribute("class", "due-tasks");
    dueTasks.innerHTML = "Due Date: " + assignments[i].date + "&emsp;Tasks: ";

    let check = document.createElement("div");
    check.setAttribute("class", "check");

    let assignPoints = document.createElement("p");
    assignPoints.setAttribute("class", "assignment-points");
    assignPoints.innerHTML = assignments[i].points + " points";

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "checkBox");

    check.appendChild(assignPoints);
    check.appendChild(checkbox);

    assign.appendChild(assignName);
    assign.appendChild(dueTasks);

    cardHeader.appendChild(assign);
    cardHeader.appendChild(check);

    card.append(cardHeader);

    parent.append(card);
  }
}

// displays a newly created assignment
async function displayNewAssignment(newAssignment) {
  // grabs the assignment array so that it can grab the newest assignment
  let assignments = await getAssignments();
  let id = assignments.length;
  var parent = document.getElementById("accordion");
   
  // creating the necessary HTML elements for the new assignment
  var card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("id", "assignment-" + id);

  var cardHeader = document.createElement("div");
  cardHeader.setAttribute("class", "card-header");
  cardHeader.setAttribute("id", "assnHeader-" + id);

  var assign = document.createElement("button");
  assign.setAttribute("onclick", "toggleButton();");
  assign.setAttribute("class", "defaultBtn");
  assign.setAttribute("data-toggle", "collapse");
  assign.setAttribute("href", "#description-" + id);

  var assignName = document.createElement("p");
  assignName.setAttribute("class", "assignment-name");
  assignName.innerHTML = newAssignment.name;

  var dueTasks = document.createElement("div");
  dueTasks.setAttribute("class", "due-tasks");
  dueTasks.innerHTML = "Due Date: " + newAssignment.date + "&emsp;Tasks: ";

  var check = document.createElement("div");
  check.setAttribute("class", "check");

  var assignPoints = document.createElement("p");
  assignPoints.setAttribute("class", "assignment-points");
  assignPoints.innerHTML = newAssignment.points + " points";

  var checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("class", "checkBox");

  check.appendChild(assignPoints);
  check.appendChild(checkbox);

  assign.appendChild(assignName);
  assign.appendChild(dueTasks);

  cardHeader.appendChild(assign);
  cardHeader.appendChild(check);

  card.append(cardHeader);

  parent.append(card); 
}