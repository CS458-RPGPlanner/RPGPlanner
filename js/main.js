// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const os = require('os');
//JSON Storage for electron
const storage = require('electron-json-storage');
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
   mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// test set json
/*
storage.set("test", { name: "hello", date: "10/20/22" }, function (error) {
  if (error) throw error;
});
*/
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
    //if object doesn't exist in the json create a new assignment in JSON
  storage.set(key, object, function (error) {
    if (error) return 'false';
  });
  
  return 'true';
}

// function to read assignments in JSON
function getAssignment(key, name) {
  //grab the json information from the json with the key
  let tempObj = storage.getSync(key);
  console.log(tempObj);
  for(let i = 0; i<tempObj.length; i++){
    if(tempObj[i].name == name){
      return tempObj[i];
    }}

    return null;
}

tempObj = [
  { name: "hello", date: "10/20/22" },
  { name: 'hi', date: "11/20/22", tasks: {name: 'science project'}}
];

booleanVal = createAssignment("Assignments", tempObj);
//getObj = getAssignment("MOCK_DATA_ASSIGNMENTS", "Ciconia episcopus");
getObj = getAssignment('Assignments', "hello")

console.log(booleanVal);
console.log(getObj);