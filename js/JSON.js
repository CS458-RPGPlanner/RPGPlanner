/**
 * @file JSON.js is the main file for the listeners and the html injection and manipulation
 * @author Pierce Heeschen, Max Lampa, and Tiernan
 */
const { ipcRenderer } = require("electron");
const { doc } = require("prettier");

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
  let result = await ipcRenderer.invoke("getAssignment", id);
  return result;
}

async function deleteAssignment(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("deleteAssignment", id);
  return result;
}

async function deleteAssignmentTasks(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("deleteAssignmentTasks", id);
  return result;
}

async function deleteTask(id) {
  // return promise value after waiting
  let result = await ipcRenderer.invoke("deleteTask", id);
  return result;
}

/**
 * @description opens html create assignment form
 */
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

/**
 * @description opens html create task form
 */
function openTaskForm() {
  document.getElementById("myTaskForm").style.display = "block";
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
 * @description clears data from create task form after submit or cancel
 */
function closeTaskForm() {
  document.getElementById("myTaskForm").style.display = "none";
  document.getElementsByName("pointsT")[0].value = "";
  document.getElementsByName("nameT")[0].value = "";
  document.getElementsByName("dateT")[0].value = "";
  document.getElementsByName("descriptionT")[0].value = "";
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
  refreshDisplayList();
  //displayNewAssignment(newAssignment);

  // close the form of the new assignment
  closeForm();
}

/**
 * @description submits assignment data and calls createAssignment function
 * @returns false if everything is not filled out correctly in the form
 */
function saveTask() {
  // declare assignment fields for html form
  let points = document.getElementsByName("pointsT")[0].value;
  let name = document.getElementsByName("nameT")[0].value;
  let date = document.getElementsByName("dateT")[0].value;
  let description = document.getElementsByName("descriptionT")[0].value;

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

  //SAVE TASKS

  // close the form of the new assignment
  closeTaskForm();
}

/**
 * @description submits assignment data and calls createAssignment function
 * @returns false if everything is not filled out correctly in the form
 */
function saveTask() {
  // declare assignment fields for html form
  let points = document.getElementsByName("pointsT")[0].value;
  let name = document.getElementsByName("nameT")[0].value;
  let date = document.getElementsByName("dateT")[0].value;
  let description = document.getElementsByName("descriptionT")[0].value;

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

  //SAVE TASKS

  // close the form of the new assignment
  closeTaskForm();
}

/**
 * @description display assignments in the ui
 */
// declared as async function so that race conditions don't apply for assignment retrieval
async function displayAssignments() {
  // creates an array of the saved assignments
  let assignments = await getAssignments();
  let allTasks = await getAllTasks();
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
    assign.setAttribute("id", "assignmentBtn-" + assignments[i].id);
    assign.setAttribute("onclick", "toggleButton(this.id); updateArrows()");
    assign.setAttribute("class", "defaultBtn");
    assign.setAttribute("data-toggle", "collapse");
    assign.setAttribute("href", "#description-" + assignments[i].id);

    let arrow = document.createElement("i");
    arrow.setAttribute("class", "fa fa-minus");
    arrow.setAttribute("id", "arrow-" + assignments[i].id);

    let assignName = document.createElement("p");
    assignName.setAttribute("class", "assignment-name");
    assignName.innerHTML = assignments[i].name;

    let dueTasks = document.createElement("div");
    dueTasks.setAttribute("class", "due-tasks");
    let taskCounter = 0;
    for (let j = 0; j < allTasks.length; j++) {
      if (allTasks[j].assignmentId == assignments[i].id) {
        taskCounter++;
      }
    }
    dueTasks.innerHTML =
      "Due Date: " +
      assignments[i].date +
      "&emsp;Tasks: " +
      taskCounter +
      "/" +
      taskCounter;

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

    assign.appendChild(arrow);
    assign.appendChild(assignName);
    assign.appendChild(dueTasks);

    cardHeader.appendChild(assign);
    cardHeader.appendChild(check);

    let desc = document.createElement("div");
    desc.setAttribute("class", "collapse");
    desc.setAttribute("id", "description-" + assignments[i].id);
    desc.setAttribute("data-parent", "#accordion");

    card.appendChild(cardHeader);
    card.appendChild(desc);

    parent.append(card);
  }

  let createCard = document.createElement("div");
  createCard.setAttribute("class", "createCard");
  createCard.setAttribute("id", "createCard");

  let createHeader = document.createElement("div");
  createHeader.setAttribute("id", "createHeader");

  let createButton = document.createElement("button");
  createButton.setAttribute("id", "createAssignmentList");
  createButton.setAttribute("class", "defaultBtn add");
  createButton.setAttribute("onclick", "openForm()");

  let createName = document.createElement("p");
  createName.setAttribute("class", "createPlus");
  createName.innerHTML = "+";

  createButton.append(createName);

  createHeader.append(createButton);

  createCard.append(createHeader);

  parent.append(createCard);

  displayTasks();
}

/**
 * @description displays a newly created assignment
 * @param {*} newAssignment passed in to add to the stack of assignments
 */
/*async function displayNewAssignment(newAssignment) {
  // grabs the assignment array so that it can grab the newest assignment
  let assignments = await getAssignments();
  let id = assignments[assignments.length - 1].id + 1;
  let parent = document.getElementById("accordion");

  // creating the necessary HTML elements for the new assignment
  let card = document.createElement("div");
  card.setAttribute("class", "card");
  card.setAttribute("id", "assignment-" + id);

  let cardHeader = document.createElement("div");
  cardHeader.setAttribute("class", "card-header");
  cardHeader.setAttribute("id", "assnHeader-" + id);

  let assign = document.createElement("button");
  assign.setAttribute("id", "assignmentBtn-" + id);
  assign.setAttribute("onclick", "toggleButton(this.id); updateArrows()");
  assign.setAttribute("class", "defaultBtn");
  assign.setAttribute("data-toggle", "collapse");
  assign.setAttribute("href", "#description-" + id);

  let arrow = document.createElement("i");
  arrow.setAttribute("class", "fa fa-minus");
  arrow.setAttribute("id", "arrow-" + id);

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

  assign.appendChild(arrow);
  assign.appendChild(assignName);
  assign.appendChild(dueTasks);

  cardHeader.appendChild(assign);
  cardHeader.appendChild(check);

  let desc = document.createElement("div");
  desc.setAttribute("class", "collapse");
  desc.setAttribute("id", "description-" + id);
  desc.setAttribute("data-parent", "#accordion");

  card.appendChild(cardHeader);
  card.appendChild(desc);

  parent.insertBefore(card, parent.lastChild);
}*/

/**
 * @description displays stored tasks to assignments
 */
async function displayTasks() {
  let tasks = await getAllTasks();

  for (let i = 0; i < tasks.length; i++) {
    let parent = document.getElementById("description-" + tasks[i].assignmentId);

    let arrow = document.getElementById("arrow-" + tasks[i].assignmentId);
    arrow.setAttribute("class", "fa fa-chevron-up");

    let taskHeader = document.createElement("div");
    taskHeader.setAttribute("id", "taskHeader-" + tasks[i].id);
    taskHeader.setAttribute("class", "card-header");

    let task = document.createElement("button");
    task.setAttribute("class", "defaultBtn task");
    task.setAttribute("id", "taskBtn-" + tasks[i].id);
    task.setAttribute("onclick", "toggleButton(this.id);");
    task.setAttribute("data-toggle", "collapse");

    let taskName = document.createElement("p");
    taskName.setAttribute("class", "assignment-name");
    taskName.innerHTML = tasks[i].name;

    let due = document.createElement("div");
    due.setAttribute("class", "due-tasks");
    due.innerHTML = "Due Date: " + tasks[i].date;

    let check = document.createElement("div");
    check.setAttribute("class", "check");

    let taskPoints = document.createElement("p");
    taskPoints.setAttribute("class", "assignment-points");
    taskPoints.innerHTML = tasks[i].points + " points";

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "checkBox");

    check.appendChild(taskPoints);
    check.appendChild(checkbox);

    task.appendChild(taskName);
    task.appendChild(due);

    taskHeader.appendChild(task);
    taskHeader.appendChild(check);

    let addExists = document.getElementById("addTasksAssign-" + tasks[i].assignmentId);
    if (typeof addExists == "undefined" || addExists == null) {
      let createCard = document.createElement("div");
      createCard.setAttribute("class", "createCard");
      createCard.setAttribute("id", "addTasksAssign-" + tasks[i].assignmentId);

      let createHeader = document.createElement("div");
      createHeader.setAttribute("id", "createHeader)");

      let createButton = document.createElement("button");
      createButton.setAttribute("id", "createAssignmentList");
      createButton.setAttribute("class", "defaultBtn add");

      let createName = document.createElement("p");
      createName.setAttribute("class", "createPlus");
      createName.innerHTML = "+";

      createButton.append(createName);

      createHeader.append(createButton);

      createCard.append(createHeader);

      parent.append(createCard);
    }

    parent.insertBefore(taskHeader, parent.lastChild);
  }
}

function refreshDisplayList() {
  const assignments = document.querySelectorAll('.card')
  assignments.forEach(assign => {
    assign.remove();
  })

  let createCard = document.getElementById("createCard");
  createCard.remove();

  displayAssignments();
}

/**
 * @description delete the assignment that was clicked
 * @param {*} id the id of the assignment that is being deleted
 */
async function deleteAssignmentClicked(id) {
  let assignmentDiv = document.getElementById("assignment-" + id);

  if (assignmentDiv) {
    assignmentDiv.remove();
  }
  closeDetail();
  deleteAssignment(id);
  deleteAssignmentTasks(id);
}

/**
 * @description delete the task that was clicked
 * @param {*} id the id of the task that is being deleted
 */
 async function deleteTaskClicked(id) {
  let taskDiv = document.getElementById("taskHeader-" + id);

  if (taskDiv) {
    taskDiv.remove();
  }
  closeDetail();
  deleteTask(id);
}

/**
 * @description Deletes the selected assignment when user clicks "yes"
 * @param {*} id the id of the assignment to be deleted
 */
function confirmAssignmentDelete(id) {
  deleteAssignmentClicked(id);
  document.getElementById("confirmDiv").style.display = "none";
  document.getElementById("confirmContainer").remove();
  document.getElementById("deleteOverlay").remove();
}

/**
 * @description Deletes the selected task when user clicks "yes"
 * @param {*} id the id of the task to be deleted
 */
 function confirmTaskDelete(id) {
  deleteTaskClicked(id);
  document.getElementById("confirmDiv").style.display = "none";
  document.getElementById("confirmContainer").remove();
  document.getElementById("deleteOverlay").remove();
}

/**
 * @description Cancels assignment deletion when the user clicks "no"
 */
function cancelDelete() {
  document.getElementById("confirmDiv").style.display = "none";
  document.getElementById("confirmContainer").remove();
  document.getElementById("deleteOverlay").remove();
}

/**
 * @description Creates a popup that asks the user to confirm assignment deletion
 * @param {*} id the id of the assignment that is being deleted
 */
async function deleteAssignmentPopup(id) {
  let parent = document.getElementById("confirmDiv");
  //display the popup
  parent.style.display = "block";
  //draw the background overlay
  let overlay = document.createElement("div");
  overlay.setAttribute("class", "darken-overlay");
  overlay.setAttribute("id", "deleteOverlay");
  //draw the contents of the popup
  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("id", "confirmContainer");
  containerDiv.setAttribute("class", "confirm-container");

  let btnText = document.createElement("p");
  btnText.setAttribute("id", "deleteBtnTxt");
  btnText.innerHTML = "Are you sure you want to delete this assignment?";

  let yesBtn = document.createElement("button");
  yesBtn.setAttribute("id", "deleteYes");
  yesBtn.setAttribute("onclick", "confirmAssignmentDelete(" + id + ")");
  yesBtn.innerHTML = "Yes";

  let noBtn = document.createElement("button");
  noBtn.setAttribute("id", "deleteNo");
  noBtn.setAttribute("onclick", "cancelDelete()");
  noBtn.innerHTML = "No";
  //append to confirmDiv
  parent.append(overlay);
  parent.append(containerDiv);
  containerDiv.append(btnText);
  containerDiv.append(yesBtn);
  containerDiv.append(noBtn);

}

/**
 * @description Creates a popup that asks the user to confirm task deletion
 * @param {*} id the id of the task that is being deleted
 */
 async function deleteTaskPopup(id) {
  let parent = document.getElementById("confirmDiv");
  //display the popup
  parent.style.display = "block";
  //draw the background overlay
  let overlay = document.createElement("div");
  overlay.setAttribute("class", "darken-overlay");
  overlay.setAttribute("id", "deleteOverlay");
  //draw the contents of the popup
  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("id", "confirmContainer");
  containerDiv.setAttribute("class", "confirm-container");

  let btnText = document.createElement("p");
  btnText.setAttribute("id", "deleteBtnTxt");
  btnText.innerHTML = "Are you sure you want to delete this task?";

  let yesBtn = document.createElement("button");
  yesBtn.setAttribute("id", "deleteYes");
  yesBtn.setAttribute("onclick", "confirmTaskDelete(" + id + ")");
  yesBtn.innerHTML = "Yes";

  let noBtn = document.createElement("button");
  noBtn.setAttribute("id", "deleteNo");
  noBtn.setAttribute("onclick", "cancelDelete()");
  noBtn.innerHTML = "No";
  //append to confirmDiv
  parent.append(overlay);
  parent.append(containerDiv);
  containerDiv.append(btnText);
  containerDiv.append(yesBtn);
  containerDiv.append(noBtn);
}

/**
 * @description Deletes the selected assignment when user clicks "yes"
 * @param {*} id the id of the assignment to be deleted
 */
function confirmDelete(id) {
  deleteAssignmentClicked(id);
  document.getElementById("confirmDiv").style.display = "none";
  document.getElementById("confirmContainer").remove();
  document.getElementById("deleteOverlay").remove();
}

/**
 * @description Cancels assignment deletion when the user clicks "no"
 */
function cancelDelete() {
  document.getElementById("confirmDiv").style.display = "none";
  document.getElementById("confirmContainer").remove();
  document.getElementById("deleteOverlay").remove();
}

/**
 * @description Creates a popup that asks the user to confirm assignment deletion
 * @param {*} id the id of the assignment that is being deleted
 */
async function deleteConfirm(id) {
  let parent = document.getElementById("confirmDiv");
  //display the popup
  parent.style.display = "block";
  //draw the background overlay
  let overlay = document.createElement("div");
  overlay.setAttribute("class", "darken-overlay");
  overlay.setAttribute("id", "deleteOverlay");
  //draw the contents of the popup
  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("id", "confirmContainer");
  containerDiv.setAttribute("class", "confirm-container");

  let btnText = document.createElement("p");
  btnText.setAttribute("id", "deleteBtnTxt");
  btnText.innerHTML = "Are you sure you want to delete this assignment?";

  let yesBtn = document.createElement("button");
  yesBtn.setAttribute("id", "deleteYes");
  yesBtn.setAttribute("onclick", "confirmDelete(" + id + ")");
  yesBtn.innerHTML = "Yes";

  let noBtn = document.createElement("button");
  noBtn.setAttribute("id", "deleteNo");
  noBtn.setAttribute("onclick", "cancelDelete()");
  noBtn.innerHTML = "No";
  //append to confirmDiv
  parent.append(overlay);
  parent.append(containerDiv);
  containerDiv.append(btnText);
  containerDiv.append(yesBtn);
  containerDiv.append(noBtn);

}

/**
 * @description display the details of the assignment on the page
 * @param {*} id of the assignment to be displayed
 */
async function displayDetails(id) {
  //Get the assignment data based on assignment id
  let assignment = await getAssignment(id);
  let tasks = await getAllTasks();
  //console.log(assignment);

  //Creating HTML elements to display assignment data
  let parent = document.getElementById("details");

  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("id", "containerDiv");
  containerDiv.setAttribute("class", "conAssign");
  containerDiv.setAttribute("data-container-id", id);

  //assignment name
  let controlBtns = document.createElement("div");
  controlBtns.setAttribute("class", "details-assignment-name");
  //controlBtns.setAttribute("style", "justify-content:flex-end;");

  let editBtn = document.createElement("button");
  editBtn.setAttribute("class", "edit-button");
  editBtn.setAttribute("id", "editBtn");
  editBtn.innerHTML = "<i class='fas fa-pencil-alt'></i>";

  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "delete-button");
  deleteBtn.setAttribute("id", "deleteBtn");
  deleteBtn.setAttribute(
    "onclick",
    "deleteAssignmentPopup(" + id + ");"
  );
  deleteBtn.innerHTML = "<i class='far fa-trash-alt'></i>";

  let closeBtn = document.createElement("button");
  closeBtn.setAttribute("class", "close-button");
  closeBtn.setAttribute("id", "closeBtn");
  closeBtn.setAttribute("onclick", "closeDetail();");
  closeBtn.innerHTML = "&#8249";

  let assnName = document.createElement("div");
  assnName.setAttribute("class", "details-title");
  assnName.innerHTML = assignment.name;

  let dueDate = document.createElement("div");
  dueDate.setAttribute("class", "details-due-date");
  dueDate.innerHTML = "Due Date: " + assignment.date + "&emsp;Tasks: ";

  let checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("class", "detailsCheckBox");
  checkBox.setAttribute("id", "detailsPointsBox");

  let points = document.createElement("p");
  points.setAttribute("class", "details-points");
  points.setAttribute("id", "detailsPoints");
  points.innerHTML = assignment.points + " points";

  let desc = document.createElement("p");
  desc.setAttribute("class", "details-desc");
  desc.innerHTML = assignment.description;

  let taskwind = document.createElement("div");
  taskwind.setAttribute("class", "details-tasks-window");

  let createCard = document.createElement("div");
        createCard.setAttribute("class", "createTaskBtnDiv");
        createCard.setAttribute("id", "addTasksAssign-" + assignment.id);

        let createHeader = document.createElement("div");
        createHeader.setAttribute("id", "createHeader)");

        let createButton = document.createElement("button");
        createButton.setAttribute("id", "createAssignmentList");
        createButton.setAttribute("class", "defaultBtn add details");

        let createName = document.createElement("p");
        createName.setAttribute("class", "createPlus");
        createName.innerHTML = "+";

        createButton.appendChild(createName);

        createHeader.appendChild(createButton);

        createCard.appendChild(createHeader);

        taskwind.appendChild(createCard);
      
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].assignmentId === assignment.id)
    {
    //let parent = document.getElementById("description-" + tasks[i].assignmentId);

    let taskHeader = document.createElement("div");
    taskHeader.setAttribute("id", "taskHeader-" + tasks[i].id);
    taskHeader.setAttribute("class", "card-header");

    let task = document.createElement("button");
    task.setAttribute("class", "defaultBtn task");
    task.setAttribute("id", "taskBtn-" + tasks[i].id);
    task.setAttribute("data-toggle", "collapse");

    let taskName = document.createElement("p");
    taskName.setAttribute("class", "assignment-name");
    taskName.innerHTML = tasks[i].name;

    let due = document.createElement("div");
    due.setAttribute("class", "due-tasks");
    due.innerHTML = "Due Date: " + tasks[i].date;

    let check = document.createElement("div");
    check.setAttribute("class", "check");

    let taskPoints = document.createElement("p");
    taskPoints.setAttribute("class", "assignment-points");
    taskPoints.innerHTML = tasks[i].points + " points";

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "checkBox");

    check.appendChild(taskPoints);
    check.appendChild(checkbox);

    task.appendChild(taskName);
    task.appendChild(due);

    taskHeader.appendChild(task);
    taskHeader.appendChild(check);

    taskwind.appendChild(taskHeader);

    
      
    
    }
  }
  
  parent.append(containerDiv);

  containerDiv.append(controlBtns);

  //appending to parent the controlbtns
  controlBtns.append(deleteBtn);
  controlBtns.append(editBtn);

  //appending to the parent the assignment stuff
  containerDiv.append(assnName);
  containerDiv.append(dueDate);
  containerDiv.append(checkBox);
  containerDiv.append(points);
  containerDiv.append(desc);
  containerDiv.append(closeBtn);
  containerDiv.append(taskwind);
}

/**
 * @description display the details of the task on the page
 * @param {*} id of the task to be displayed
 */
 async function displayTaskDetails(id) {
  //Get the task data based on the task id
  let tasks = await getAllTasks();
  for (let i = 0; i < tasks.length; i++) 
  {
    if (tasks[i].id == id)
    {
      let assignment = await getAssignment(tasks[i].assignmentId);

      //Creating HTML elements to display task data
      let parent = document.getElementById("details");

      let containerDiv = document.createElement("div");
      containerDiv.setAttribute("id", "containerDiv");
      containerDiv.setAttribute("class", "conTask");
      containerDiv.setAttribute("data-container-id", id);

      //assignment name
      let controlBtns = document.createElement("div");
      controlBtns.setAttribute("class", "details-task-name");
      //controlBtns.setAttribute("style", "justify-content:flex-end;");

      let editBtn = document.createElement("button");
      editBtn.setAttribute("class", "edit-button");
      editBtn.setAttribute("id", "editBtn");
      editBtn.innerHTML = "<i class='fas fa-pencil-alt'></i>";

      let deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "delete-button");
      deleteBtn.setAttribute("id", "deleteBtn");
      /*deleteBtn.setAttribute(
        "onclick",
        "deleteTaskClicked(" + id + ");closeDetail();"
      );*/
      deleteBtn.innerHTML = "<i class='far fa-trash-alt'></i>";

      let closeBtn = document.createElement("button");
      closeBtn.setAttribute("class", "close-button");
      closeBtn.setAttribute("id", "assignmentBtn-" + assignment.id);
      closeBtn.setAttribute("onclick", "toggleButton(this.id)");
      closeBtn.innerHTML = "&#8249";

      let assn = document.createElement("div");
      assn.setAttribute("class", "taskAssign");
      assn.innerHTML = "Return to " + assignment.name;

      let assnName = document.createElement("div");
      assnName.setAttribute("class", "details-title");
      assnName.innerHTML = tasks[i].name;

      let dueDate = document.createElement("div");
      dueDate.setAttribute("class", "details-due-date");
      dueDate.innerHTML = "Due Date: " + tasks[i].date;

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("class", "detailsCheckBox");
      checkBox.setAttribute("id", "detailsPointsBox");

      let points = document.createElement("p");
      points.setAttribute("class", "details-points");
      points.setAttribute("id", "detailsPoints");
      points.innerHTML = tasks[i].points + " points";

      let desc = document.createElement("p");
      desc.setAttribute("class", "details-desc");
      desc.innerHTML = tasks[i].description;

      parent.append(containerDiv);

      containerDiv.append(controlBtns);

      //appending to parent the controlbtns
      controlBtns.append(deleteBtn);
      controlBtns.append(editBtn);

  //appending to the parent the assignment stuff
  containerDiv.append(assnName);
  containerDiv.append(dueDate);
  containerDiv.append(checkBox);
  containerDiv.append(points);
  containerDiv.append(desc);
  containerDiv.append(closeBtn);
  containerDiv.append(taskwind);
}

/**
 * @description display the details of the task on the page
 * @param {*} id of the task to be displayed
 */
async function displayTaskDetails(id) {
  //Get the task data based on the task id
  let tasks = await getAllTasks();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      let assignment = await getAssignment(tasks[i].assignmentId);

      //Creating HTML elements to display task data
      let parent = document.getElementById("details");

      let containerDiv = document.createElement("div");
      containerDiv.setAttribute("id", "containerDiv");
      containerDiv.setAttribute("class", "conTask");
      containerDiv.setAttribute("data-container-id", id);

      //assignment name
      let controlBtns = document.createElement("div");
      controlBtns.setAttribute("class", "details-task-name");
      //controlBtns.setAttribute("style", "justify-content:flex-end;");

      let editBtn = document.createElement("button");
      editBtn.setAttribute("class", "edit-button");
      editBtn.setAttribute("id", "editBtn");
      editBtn.innerHTML = "<i class='fas fa-pencil-alt'></i>";

      let deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "delete-button");
      deleteBtn.setAttribute("id", "deleteBtn");
      /*deleteBtn.setAttribute(
        "onclick",
        "deleteTaskClicked(" + id + ");closeDetail();"
      );*/
      deleteBtn.innerHTML = "<i class='far fa-trash-alt'></i>";

      let closeBtn = document.createElement("button");
      closeBtn.setAttribute("class", "close-button");
      closeBtn.setAttribute("id", "assignmentBtn-" + assignment.id);
      closeBtn.setAttribute("onclick", "toggleButton(this.id)");
      closeBtn.innerHTML = "&#8249";

      let assn = document.createElement("div");
      assn.setAttribute("class", "taskAssign");
      assn.innerHTML = "Return to " + assignment.name;

      let assnName = document.createElement("div");
      assnName.setAttribute("class", "details-title");
      assnName.innerHTML = tasks[i].name;

      let dueDate = document.createElement("div");
      dueDate.setAttribute("class", "details-due-date");
      dueDate.innerHTML = "Due Date: " + tasks[i].date;

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("class", "detailsCheckBox");
      checkBox.setAttribute("id", "detailsPointsBox");

      let points = document.createElement("p");
      points.setAttribute("class", "details-points");
      points.setAttribute("id", "detailsPoints");
      points.innerHTML = tasks[i].points + " points";

      let desc = document.createElement("p");
      desc.setAttribute("class", "details-desc");
      desc.innerHTML = tasks[i].description;

      parent.append(containerDiv);

      containerDiv.append(controlBtns);

      //appending to parent the controlbtns
      controlBtns.append(deleteBtn);
      controlBtns.append(editBtn);

      //appending to the parent the assignment stuff
      containerDiv.append(assnName);
      containerDiv.append(dueDate);
      containerDiv.append(checkBox);
      containerDiv.append(points);
      containerDiv.append(desc);
      containerDiv.append(closeBtn);
      containerDiv.append(assn);
    }
  }
}

/**
 * @description display the details of the task on the page
 * @param {*} id of the task to be displayed
 */
 async function displayTaskDetails(id) {
  //Get the task data based on the task id
  let tasks = await getAllTasks();
  for (let i = 0; i < tasks.length; i++) 
  {
    if (tasks[i].id == id)
    {
      let assignment = await getAssignment(tasks[i].assignmentId);

      //Creating HTML elements to display task data
      let parent = document.getElementById("details");

      let containerDiv = document.createElement("div");
      containerDiv.setAttribute("id", "containerDiv");
      containerDiv.setAttribute("class", "conTask");
      containerDiv.setAttribute("data-container-id", id);

      //assignment name
      let controlBtns = document.createElement("div");
      controlBtns.setAttribute("class", "details-task-name");
      //controlBtns.setAttribute("style", "justify-content:flex-end;");

      let editBtn = document.createElement("button");
      editBtn.setAttribute("class", "edit-button");
      editBtn.setAttribute("id", "editBtn");
      editBtn.innerHTML = "<i class='fas fa-pencil-alt'></i>";

      let deleteBtn = document.createElement("button");
      deleteBtn.setAttribute("class", "delete-button");
      deleteBtn.setAttribute("id", "deleteBtn");
      deleteBtn.setAttribute(
        "onclick",
        "deleteTaskPopup(" + id + ");"
      );
      deleteBtn.innerHTML = "<i class='far fa-trash-alt'></i>";

      let closeBtn = document.createElement("button");
      closeBtn.setAttribute("class", "close-button");
      closeBtn.setAttribute("id", "assignmentBtn-" + assignment.id);
      closeBtn.setAttribute("onclick", "toggleButton(this.id)");
      closeBtn.innerHTML = "&#8249";

      let assn = document.createElement("div");
      assn.setAttribute("class", "taskAssign");
      assn.innerHTML = "Return to " + assignment.name;

      let assnName = document.createElement("div");
      assnName.setAttribute("class", "details-title");
      assnName.innerHTML = tasks[i].name;

      let dueDate = document.createElement("div");
      dueDate.setAttribute("class", "details-due-date");
      dueDate.innerHTML = "Due Date: " + tasks[i].date;

      let checkBox = document.createElement("input");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("class", "detailsCheckBox");
      checkBox.setAttribute("id", "detailsPointsBox");

      let points = document.createElement("p");
      points.setAttribute("class", "details-points");
      points.setAttribute("id", "detailsPoints");
      points.innerHTML = tasks[i].points + " points";

      let desc = document.createElement("p");
      desc.setAttribute("class", "details-desc");
      desc.innerHTML = tasks[i].description;

      parent.append(containerDiv);

      containerDiv.append(controlBtns);

      //appending to parent the controlbtns
      controlBtns.append(deleteBtn);
      controlBtns.append(editBtn);

      //appending to the parent the assignment stuff
      containerDiv.append(assnName);
      containerDiv.append(dueDate);
      containerDiv.append(checkBox);
      containerDiv.append(points);
      containerDiv.append(desc);
      containerDiv.append(closeBtn);
      containerDiv.append(assn);
    }
  }
}

/**
 * @description update the arrows by putting in the opposite position when clicked
 */
async function updateArrows() {
  // Add up down arrow for collapse element which
  // is open by default
  $(".collapse.show").each(function () {
    $(this)
      .prev(".card-header")
      .find(".fa")
      .addClass("fa-chevron-down")
      .removeClass("fa-chevron-up");
  });
  // Toggle up down arrow icon on show hide
  // of collapse element
  $(".collapse")
    .on("show.bs.collapse", function () {
      $(this)
        .prev(".card-header")
        .find(".fa")
        .removeClass("fa-chevron-up")
        .addClass("fa-chevron-down");
    })
    .on("hide.bs.collapse", function () {
      $(this)
        .prev(".card-header")
        .find(".fa")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");
    });
}
