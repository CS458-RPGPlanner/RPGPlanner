/**
 * @file JSON.js is the main file for the listeners and the html injection and manipulation
 * @author Pierce Heeschen, Max Lampa, and Tiernan
 */
const { ipcRenderer } = require("electron");

// Function to delete an assignment based on the id of the assignment

// Renderer process

/**
 * @description html function to create a task based off the values in html task object passed in
 * @param {*} obj object passed in to place in the task json
 * @returns object that was passed in
 */
async function createTask(obj) {
  let result = await ipcRenderer.invoke("createTask", obj);
  //return promise value after waiting
  return result;
}

/**
 * @description html function to create a task based off the values in html task object passed in
 * @returns object that was passed in
 */
getAllTasks();
async function getAllTasks() {
  let result = await ipcRenderer.invoke("getAllTasks");
  //return promise value after waiting
  return result;
}

/**
 * @description html function to create an assignment based off the values in html assignment object passed in
 * @param {*} obj object passed in to place in the assignment json
 * @returns object that was passed in
 */
async function createAssignment(obj) {
  let result = await ipcRenderer.invoke("createAssignment", obj);
  //return promise value after waiting
  return result;
}

/**
 * @description html javascript function to get all assignments
 * @returns returned array of all assignments
 */
async function getAssignments() {
  //return promise value after waiting
  let result = await ipcRenderer.invoke("getAllAssignments");
  return result;
}

/**
 * @description html function to get an assignment by the id
 * @param {*} id of the assignment to retrieve from the json
 * @returns the assignment that matches the id passed in
 */
async function getAssignment(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("getAssignmentById", id);
  return result;
}

async function deleteAssignment(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("deleteAssignment", id);
  return result;
}

/**
 * @description opens html create assignment form
 */
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

/**
 * @description clears data from create assignment form after submit or cancel
 */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementsByName("points")[0].value = "";
  document.getElementsByName("name")[0].value = "";
  document.getElementsByName("date")[0].value = "";
  document.getElementsByName("description")[0].value = "";
}

/**
 * @description submits assignment data and calls createAssignment function
 * @returns false if everything is not filled out correctly in the form
 */
function saveAssignment() {
  // declare assignment fields for html form
  let points = document.getElementsByName("points")[0].value;
  let name = document.getElementsByName("name")[0].value;
  let date = document.getElementsByName("date")[0].value;
  let description = document.getElementsByName("description")[0].value;

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
/**
 * @description display assignments in the ui
 */
// declared as async function so that race conditions don't apply for assignment retrieval
async function displayAssignments() {
  // creates an array of the saved assignments
  let assignments = await getAssignments();
  //testing to make sure that assignments are loaded correctly
  //alert(assignments[0]);

  let parent = document.getElementById("accordion");

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
  let parent = document.getElementById("accordion");

  // creating the necessary HTML elements for the new assignment
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("id", "assignment-" + id);

  let cardHeader = document.createElement("div");
  cardHeader.setAttribute("class", "card-header");
  cardHeader.setAttribute("id", "assnHeader-" + id);

  let assign = document.createElement("button");
  assign.setAttribute("onclick", "toggleButton();");
  assign.setAttribute("class", "defaultBtn");
  assign.setAttribute("data-toggle", "collapse");
  assign.setAttribute("href", "#description-" + id);

  let assignName = document.createElement("p");
  assignName.setAttribute("class", "assignment-name");
  assignName.innerHTML = newAssignment.name;

  let dueTasks = document.createElement("div");
  dueTasks.setAttribute("class", "due-tasks");
  dueTasks.innerHTML = "Due Date: " + newAssignment.date + "&emsp;Tasks: ";

  let check = document.createElement("div");
  check.setAttribute("class", "check");

  let assignPoints = document.createElement("p");
  assignPoints.setAttribute("class", "assignment-points");
  assignPoints.innerHTML = newAssignment.points + " points";

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

function deleteAssignmentClicked(id) {

  let assignmentDiv = document.getElementById("assignment-" + id);
  if (assignmentDiv) {
    assignmentDiv.remove();
  }
  deleteAssignment(id);
}
