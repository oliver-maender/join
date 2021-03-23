// currentID needs to be stored in the backend or it will get reset
let currentID = 0;

let allTasks = [];

//MDL Variables
let snackbarContainer;
let showToastButton;

setURL('http://gruppe-63.developerakademie.com/Join/smallest_backend_ever');



/**
 * Loads content at the startup of the board page
 */
function initBoard() {

  includeHTML();

  if (getArray('allTasks') != null) {
    allTasks = getArray('allTasks');
  }
    
}

/**
 * Loads content at the startup of the board page
 */
 function initBacklog() {

  includeHTML();

  if (getArray('allTasks') != null) {
    allTasks = getArray('allTasks');
  }

  showBacklog();
  
}

/**
 * Loads content at the startup of the board page
 */
 function initAddTask() {

  includeHTML();

  if (getArray('allTasks') != null) {
    allTasks = getArray('allTasks');
  }

  snackbarContainer = document.getElementById('demo-toast-example');
  showToastButton = document.getElementById('create-btn');
  listenForPopup();
}

/**
 * Manages the ability to add a task to the backlog
 */
function addTask() {

  let task = getValues();

  //if (task != false) {
    allTasks.push(task);
  //}

  setArray('allTasks', allTasks);

}

/**
 * Gets the values of the HTML input fields and calls the function createTask() which creates the JSON for the task
 * 
 * @returns JSON
 */
function getValues() {

  let title = document.getElementById('title-input').value;
  let dueDate = document.getElementById('due-date-input').value;
  let category = document.getElementById('category-input').value;
  let urgency = document.getElementById('urgency-input').value;
  let description = document.getElementById('description-input').value;
  let currentDate = new Date().getTime();

  return createTask(title, dueDate, category, urgency, description, currentDate);

  // Checks for empty input fields because HTML form's "required" seems not to be enough (?)
  //[PAUL] I added onsubmit="addTask();return false" on form tag and required von every input and select tag within the form. So the following code is not necessary.
  /* if (title.length > 0 && dueDate.length > 0 && category.length > 0 && urgency.length > 0 && description.length > 0) {
    return createTask(title, dueDate, category, urgency, description, currentDate);
  }
  else {
    return false;
  } */

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
function createTask(title, dueDate, category, urgency, description, currentDate) {

  return {
    "id": currentID,
    "title": title,
    "due-date": dueDate,
    "category": category,
    "urgency": urgency,
    "description": description,
    "assignedTo": "",
    "status": "backlog",
    "current-date": currentDate
  }

}

/**
 * MDL (material design lite) function
 * Shows a short popup when a task has been successfully created and pushed to backlog.
 */
function listenForPopup() {

  (function() {
    'use strict';
    var snackbarContainer = document.getElementById('demo-toast-example');
    var showToastButton = document.getElementById('create-btn');
    showToastButton.addEventListener('click', function() {
      'use strict';
      var data = {message: 'Task pushed to board'};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
  }());

}

function showSnackbar(msg) {
  let data = {message: msg};
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function showBacklog() {

  let backlog = document.getElementById('backlog');

  for (let i = 0; i < allTasks.length; i++) {

    backlog.innerHTML += addBacklogElement(i, allTasks[i].category, allTasks[i].description);

  }

}

function addBacklogElement(id, category, description) {

  return `

    <div id="backlog-element-${id}" class="backlog-element">
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