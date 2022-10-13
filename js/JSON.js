const storage = require("electron-json-storage");

//grab the appdata path for storing the json files
filePath = app.getPath("appData");

//set the storage path for the json
storage.setDataPath(filePath);
storage.set("test", { name: "hello", date: "10/20/22" }, function (error) {
  if (error) throw error;
});

/**
 * JSON SCHEMA - ASSIGNMENTS
 * name: STRING
 * date: STRING
 * points: INT
 * tasks: STRING ARRAY
 * description: STRING
 *
 * JSON SCHEMA - TASKS
 * name: STRING
 * date: STRING
 * points: INT
 * description: STRING
 *
 */

// Function to create an assignment in JSON
// TODO: change get to has
function createAssignment(key, object) {
  //check to make sure assignment doesn't already exist returns null obj if doesn't exist
  let tempObj = storage.get(key, function (error, data) {
    if (error) throw error;
  });

  //if object doesn't exist in the json create a new assignment in JSON
  if (tempObj == null) {
    storage.set(key, object, function (error) {
      if (error) throw error;
    });
    //return true if created successfully
    return "true";
  }
  //throw an error if there is already an assignment there
  // TODO: define error - maybe message
  else {
    throw error;
    //return false if not able to create the assignment
    return "false";
  }
}

// function to read assignments in JSON
function getAssignment(key) {
  //grab the json information from the json with the key
  tempObj;
  storage.get(key, function (error, data) {
    if (error) throw error;
    tempObj = data;
  });
  
  //return object of JSON
  return tempObj;
}

tempObj = { name: "hello", date: "10/20/22" };

booleanVal = createAssignment("test", tempObj);
getObj = getAssignment("test");

console.log(booleanVal);
console.log(getObj);