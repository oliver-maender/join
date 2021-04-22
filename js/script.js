let allTasks = [];

let allUsers = [];

/* let allUsers = [
  {
    "name": "Paul",
    "img": "../img/paul.png",
    "email": "paul@mail.de",
    "checkedStatus": false,
    "password": "1bb78288d604d97f57237f3a1586b567b928d97b9bdbdbf44855be2f3c75bea7"
  },
  {
    "name": "Oliver",
    "img": "../img/oliver.jpg",
    "email": "oliver@gmail.com",
    "checkedStatus": false,
    "password": "3dc9ade97759bffcdeb9c5adca0b1614f02f0c67cc47cf72a78cf2f8163341a4"
  },
  {
    "name": "Tomislav",
    "img": "../img/tomislav.jpg",
    "email": "tomislav@web.de",
    "checkedStatus": false,
    "password": "442fa2167e29c1843cd3cf62a8951ac0ad6eab20ef99282d89f34c347e9451b8"
  }
]; */


let currentDraggedElement;

/**
 * Loads content which is necessary at the startup for all underpages.
 */
async function init() {
  includeHTML();
  allUsers = await getArrayFromBackend('allUsers');
  allTasks = await getArrayFromBackend('allTasks');
  showLoggedInUser();
}

//for login and registration
async function initUsers() {
  allUsers = await getArrayFromBackend('allUsers');
  console.log("initUsers() wurde aufgerufen!");
}










async function initFAQ() {
  await init();
  setTimeout(function () {
    document.getElementsByClassName("content-container")[0].innerHTML += removeGhostHeader();
  }, 100);
}

async function initLegalNotice() {
  await init();
  setTimeout(function () {
    document.getElementsByClassName("content-container")[0].innerHTML += removeGhostHeader();
  }, 100);
}

async function initDataPrivacy() {
  await init();
  setTimeout(function () {
    document.getElementsByClassName("content-container")[0].innerHTML += removeGhostHeader();
  }, 100);
}

function removeGhostHeader() {
  return `
    <div class="init">initialised</div>
  `;
}

function changeNavbar() {
  let button = document.getElementById('change-navbar-btn');
  let header = document.getElementById('header');
  let headerLinks = document.getElementById('header-links');
  let headerTexts = document.getElementsByClassName('header-txt');
  // let headerIcons = document.getElementsByClassName('header-icon');

  if (button.innerHTML == "&gt;") {
    for (let i = 0; i < headerTexts.length; i++) {
      const text = headerTexts[i];
      // header.classList.remove('header');
      header.classList.add('expanded-header');
      headerLinks.classList.remove('hl-dont-show');
      headerLinks.classList.add('hl-show');
      // text.classList.remove('d-none');
      // text.classList.add('d-block');
    }

    // for (let i = 0; i < headerIcons.length; i++) {
    //   const icons = headerIcons[i];
    //   icons.classList.remove('d-block');
    //   icons.classList.add('d-none');
    // }

    // document.getElementById('header').style.width = 'calc(var(--header-width) + 100px)';

    button.innerHTML = "&lt;";

  }
  else {
    for (let i = 0; i < headerTexts.length; i++) {
      const text = headerTexts[i];
      header.classList.remove('expanded-header');
      headerLinks.classList.remove('hl-show');
      headerLinks.classList.add('hl-dont-show');
      // text.classList.remove('d-block');
      // text.classList.add('d-none');
      // header.classList.add('header');
    }

    // for (let i = 0; i < headerIcons.length; i++) {
    //   const icons = headerIcons[i];
    //   icons.classList.add('d-block');
    //   icons.classList.remove('d-none');
    // }

    // document.getElementById('header').style.width = 'var(--header-width)';

    button.innerHTML = "&gt;";
  }
}




/**
 * MDL (material design lite) function
 * Shows a short popup with a message when a task has been successfully created and pushed to backlog.
 * 
 * @param {string} msg - Messgage for the popup.
 */
function showSnackbar(msg) {
  let snackbarContainer = document.getElementById('snackbar-container');
  let data = { message: msg };
  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}









/**
 * Opens the task in a dialog window with different content depending on the current location.
 * @param  {number} id - Task number.
 * @param  {string} loc - Location (board or backlog).
 */
function openTask(id, loc) {

  let assignedToNames = [];

  for (let i = 0; i < allTasks[id].assignedTo.length; i++) {
    assignedToNames.push(allTasks[id].assignedTo[i].name);
  }

  document.getElementById('dialogTask').innerHTML = generateHTMLForOpenTask(id, loc, assignedToNames);

  fillDialog();
}


/**
 * Generates the HTML code for openTask()
 * 
 * @param  {number} id - Task number.
 * @param  {string} loc - Location (board or backlog).
 * @param  {object} assignedToNames - Array of all users' names who have been chosen for a task.
 */
function generateHTMLForOpenTask(id, loc, assignedToNames) {

  if (loc == 'backlog') {
    return ` <table class="table-task mdl-dialog__content">
                        <tr>
                            <td>Current&nbsp;Date</td>
                            <td>${new Date(allTasks[id]['currentDate'])}</td>
                        </tr>
                        <tr>
                            <td>Title</td>
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
                            <td><div class="dialog-description">${allTasks[id]['description']}</div></td>
                        </tr>
                        <tr>
                            <td>Assigned&nbsp;To</td>
                            <td>${assignedToNames}</td>
                        </tr>
                        <tr>
                            <td>Due Date</td>
                            <td>${allTasks[id]['dueDate']}</td>
                        </tr>
              </table>
              <div class="mdl-dialog__actions">
                  <button type="button" onclick="deleteTask(${id}, 'backlog')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect close btn btn-delete">Delete</button>
                  <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect close btn">Close</button>
                  <button type="button" onclick="pushToBoard(${id})" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect close btn">to board</button>
              </div>`;
  }

  if (loc == 'board') {
    return ` <table class="table-task mdl-dialog__content">
                        <tr>
                          <td>Current&nbsp;Date</td>
                          <td>${new Date(allTasks[id]['currentDate'])}</td>
                        </tr>
                        <tr>
                          <td>Title</td>
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
                          <td><div class="dialog-description">${allTasks[id]['description']}</div></td>
                        </tr>
                        <tr>
                          <td>Assigned&nbsp;To</td>
                          <td>${assignedToNames}</td>
                        </tr>
                        <tr>
                          <td>Due Date</td>
                          <td>${allTasks[id]['dueDate']}</td>
                        </tr>
                </table>

                <div class="mdl-dialog__actions">
                  <button type="button" onclick="pushToColumn(${id}, 'toDo')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect btn close">To Do</button>
                  <button type="button" onclick="pushToColumn(${id}, 'inProgress')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect btn close">In Progress</button>
                  <button type="button" onclick="pushToColumn(${id}, 'testing')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect btn close">Testing</button>
                  <button type="button" onclick="pushToColumn(${id}, 'done')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect btn close">Done</button>
                  <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect close btn">Close</button>
                  <button type="button" onclick="deleteTask(${id}, 'board')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect close btn btn-delete">Delete</button>
                </div>
    `;

  }
}




/**
 * MDL function
 * Fills the MDL dialog with content.
 */
function fillDialog() {
  var dialog = document.querySelector('dialog');

  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.showModal();

  let closeElements = dialog.querySelectorAll('.close');

  for (let i = 0; i < closeElements.length; i++) {

    closeElements[i].addEventListener('click', function () {
      dialog.close();
    });
  }
}





/**
 * Deletes a task and calls showBoard() or showBacklog() again depending on the current location.
 * @param  {number} id - Id of the task.
 * @param  {string} loc - Location (board or backlog).
 */
async function deleteTask(id, loc) {

  // the next line is only for testing purposes
  allTasks = await getArrayFromBackend('allTasks');

  allTasks.splice(id, 1);

  for (let i = id; i < allTasks.length; i++) {
    allTasks[i].id = i;
  }

  saveArrayToBackend('allTasks', allTasks);
  // the next line is only for testing purposes but this feels like it helps
  allTasks = await getArrayFromBackend('allTasks');

  if (loc == 'board') {
    showBoard();
  }
  else if (loc == 'backlog') {
    showBacklog();
  }

}







/* LOCAL STORAGE */

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
  return JSON.parse(backend.getItem(key)) || [];
}

/**
 * Saves the changed array object (allTasks) to backend.
 * 
 * @param  {string} key
 * @param  {obj} array
 */
async function saveArrayToBackend(key, array) {
  await backend.setItem(key, JSON.stringify(array));
}


/**
 * Just for testing. Resets allTasks or allUsers.
 * 
 * @param  {Object} key - Name of the array (allTasks or allUsers).
 */
function reset(key) {
  backend.deleteItem(key);
}

/**
* Prevents the reload of the page when the submit button in the add task form is clicked.
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