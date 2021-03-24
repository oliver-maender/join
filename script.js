// currentID needs to be stored in the backend or it will get reset
let currentID = 0;

let allTasks = [];

/**
 * Loads content which is necessary at the startup for all underpages.
 */
function init() {

  includeHTML();

  getArrayFromBackend('allTasks');
  getIDFromBackend('currentID');

}

/**
 * Loads content at the startup of the board page
 */
function initBoard() {
  //follows...
}

/**
 * Loads content at the startup of the backlog page
 */
function initBacklog() {

  showBacklog();

}

/**
 * Loads content at the startup of the addTask page
 */
function initAddTask() {

  preventReload();


}

/**
 * Manages the ability to add a task to the backlog
 */
function addTask() {

  let task = getValues(currentID);
  allTasks.push(task);

  saveArrayToBackend('allTasks', allTasks);

  currentID++;
  saveIDToBackend('currentID');
  /*  console.log("currentID", currentID); */

  showSnackbar("Task pushed to backlog!");
  clearFields();

}

/**
 * Gets the values of the HTML input fields and calls the function createTask() which creates the JSON for the task
 * 
 * @returns JSON
 */
function getValues(currentID) {

  let title = document.getElementById('title-input').value;
  let dueDate = document.getElementById('due-date-input').value;
  let category = document.getElementById('category-input').value;
  let urgency = document.getElementById('urgency-input').value;
  let description = document.getElementById('description-input').value;
  let currentDate = new Date().getTime();

  return createTask(currentID, title, dueDate, category, urgency, description, currentDate);

}

/**
 * Creates the JSON for the task
 * 
 * @param {string} title - title of the task
 * @param {string} dueDate - due date of the task
 * @param {string} category - category of the task
 * @param {string} urgency - urgency of the task
 * @param {string} description - description of the task
 * @param {Date} currentDate - today's date
 * @returns JSON
 */
function createTask(currentID, title, dueDate, category, urgency, description, currentDate) {

  return {
    "id": currentID,
    "title": title,
    "dueDate": dueDate,
    "category": category,
    "urgency": urgency,
    "description": description,
    "assignedTo": "",
    "status": "backlog",
    "currentDate": currentDate
  }

}

/**
 * MDL (material design lite) function
 * Shows a short popup with a message when a task has been successfully created and pushed to backlog.
 */

function showSnackbar(msg) {
  let snackbarContainer = document.getElementById('snackbar-container');
  let showToastButton = document.getElementById('create-btn');
  let data = { message: msg };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

/**
 * Clears the form input fields.
 */
function clearFields() {
  document.getElementById('title-input').value = '';
  document.getElementById('due-date-input').value = '';
  document.getElementById('category-input').value = '';
  document.getElementById('urgency-input').value = '';
  document.getElementById('description-input').value = '';
}




async function showBacklog() {
  console.log("showBacklog() wurde aufgerufen!");

  let backlog = document.getElementById('backlog');

  // Not assigned to a variable because 'allTasks' is hard-coded in the function - should be fixed but I can't get it done
  // [Paul] Fixed: Made showBacklog() an async function and put await in front of getArrayFromBackend('allTasks');
  await getArrayFromBackend('allTasks');

  for (let i = 0; i < allTasks.length; i++) {

    /* console.log("i: " + i);
    console.log("cat: " + allTasks[i].category);
    console.log("des: " + allTasks[i].description); */

    backlog.innerHTML += addBacklogElement(allTasks[i].id, allTasks[i].category, allTasks[i].description);

  }

}

function addBacklogElement(id, category, description) {

  return `

    <div onclick="openTask(${id})" id="backlog-element-${id}" class="backlog-element">
      <div class="backlog-element-color">
      </div>
      <div class="backlog-element-picture flex-center">
        <img src="./img/junus_ergin.jpg">
      </div>
      <div class="backlog-element-name">
        <span>Junus Ergin</span>
        <a class="email-adress" href="mailto:junus.ergin@googlemail.com" title="send email">junus.ergin@googlemail.com</a>
      </div>
      <div class="backlog-element-category">
        <span>${category}</span>
      </div>
      <div class="backlog-element-details">
        <span>${description}</span>
      </div>
    </div>
      
  `;
}

/**
 * MDL function
 * @param  {} id
 */
function openTask(id) {

  document.getElementById('dialogTask').innerHTML = generateHTMLForOpenTask(id);

  var dialog = document.querySelector('dialog');
  /* var showDialogButton = document.querySelector('#show-dialog'); */
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  /* showDialogButton.addEventListener('click', function() { */
  dialog.showModal();
  /*  }); */
  dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
  });
}

function generateHTMLForOpenTask(id) {
  return ` <table class="table-task mdl-dialog__content">
                        <tr>
                            <td>Current Date</td>
                            <td>${allTasks[id]['currentDate']}</td>
                        </tr>
                        <tr>
                            <td>Titel</td>
                            <td>${allTasks[id]['title']}</td>
                        </tr>
                        <tr>
                            <td>Category</td>
                            <td>${allTasks[id]['category']}</td>
                        </tr>
                        <tr>
                            <td>Urgency</td>
                            <td>${allTasks[id]['urgency']}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>${allTasks[id]['description']}</td>
                        </tr>
                        <tr>
                            <td>Assigned To</td>
                            <td>${allTasks[id]['assignedTo']}</td>
                        </tr>
              </table>
              <div class="mdl-dialog__actions">
                  <button type="button" class="mdl-button">Push to board</button>
                  <button type="button" class="mdl-button close">Close</button>
                  <button type="button" class="mdl-button">Delete</button>
              </div>`
};



/* LOCAL STORAGE */
/* May be deleted later if not used. */

/**
 * Saves an array to the local storage
 * 
 * @param {string} key 
 * @param {Array} array 
 */
function setArray(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

/**
 * Gets an array from the local storage
 * 
 * @param {string} key 
 * @returns Array
 */
function getArray(key) {
  return JSON.parse(localStorage.getItem(key));
}


/* MINI BACKEND */

setURL('http://gruppe-63.developerakademie.com/Join/smallest_backend_ever');

/**
 * @param  {string} key - Loads an array (object) from backend.
 */
async function getArrayFromBackend(key) {
  await downloadFromServer();
  allTasks = JSON.parse(backend.getItem(key)) || [];
}

/**
 * Loads the currentID variable from backend.
 * 
 * @param  {string} key
 */
async function getIDFromBackend(key) {
  await downloadFromServer();
  currentID = backend.getItem(key) || 0;
}


/**
 * Saves the changed array object (allTasks) to backend.
 * 
 * @param  {string} key
 * @param  {obj} array
 */
function saveArrayToBackend(key, array) {
  backend.setItem(key, JSON.stringify(array));
}

/**
 * Saves the currentID variable to backend.
 * 
 * @param  {string} key
 */
function saveIDToBackend(key) {
  backend.setItem(key, currentID);
}


/**
* Prevents the reload of the page when the submit button in the Add Task form is clicked.
*/
function preventReload() {
  var form = document.getElementById("add-task-form");
  function handleForm(event) { event.preventDefault(); }
  form.addEventListener('submit', handleForm);
}




/**
 * Makes the w3cInclude possible, code by w3schools.com
 * 
 * @returns 
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}