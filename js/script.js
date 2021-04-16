let allTasks = [];

let allUsers = [
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
];


let currentDraggedElement;

/**
 * Loads content which is necessary at the startup for all underpages.
 */
async function init() {
  includeHTML();
  await getArrayFromBackend('allTasks');
  showLoggedInUser();
}


/**
 * Loads content at the startup of the board page
 */
async function initBoard() {
  await init();
  showBoard();
}


/**
 * Loads content at the startup of the backlog page
 */
async function initBacklog() {
  await init();
  showBacklog();
}


/**
 * Loads content at the startup of the addTask page
 */
async function initAddTask() {
  await init();
  //setArray('allUsers', allUsers);
  showAssignedTo();
  preventReload();
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
  let headerTexts = document.getElementsByClassName('header-txt');
  let headerIcons = document.getElementsByClassName('header-icon');

  if (button.innerHTML == "&gt;") {
    for (let i = 0; i < headerTexts.length; i++) {
      const text = headerTexts[i];
      text.classList.remove('d-none');
      text.classList.add('d-block');
    }

    for (let i = 0; i < headerIcons.length; i++) {
      const icons = headerIcons[i];
      icons.classList.remove('d-block');
      icons.classList.add('d-none');
    }

    // document.getElementById('header').style.width = 'calc(var(--header-width) + 100px)';

    button.innerHTML = "&lt;";

  }
  else {
    for (let i = 0; i < headerTexts.length; i++) {
      const text = headerTexts[i];
      text.classList.add('d-none');
      text.classList.remove('d-block');
    }

    for (let i = 0; i < headerIcons.length; i++) {
      const icons = headerIcons[i];
      icons.classList.add('d-block');
      icons.classList.remove('d-none');
    }

    document.getElementById('header').style.width = 'var(--header-width)';

    button.innerHTML = "&gt;";
  }
}


/**
 * Manages the ability to add a task to the backlog
 */
async function addTask() {

  // the next line is only for testing purposes
  await getArrayFromBackend('allTasks');

  let task = getValues();
  allTasks.push(task);

  saveArrayToBackend('allTasks', allTasks);

  // the next line is only for testing purposes
  await getArrayFromBackend('allTasks');

  clearFields();
  showSnackbar("Task pushed to backlog!");

  //Show backlog page with new task added
  setTimeout(function () {
    document.location.href = "../pages/backlog.html";
  }, 3000);
}


/**
 * Gets the values of the HTML input fields and calls the function createTask() which creates the JSON for the task.
 * Caches all checked profiles and saves them into the array assignedTo which is part of the created task.
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

  let assignedTo = [];

  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].checkedStatus == true) {
      let user = { name: allUsers[i].name, img: allUsers[i].img, email: allUsers[i].email };
      assignedTo.push(user);
      allUsers[i].checkedStatus = false;
    }
  }

  return createTask(title, dueDate, category, urgency, description, assignedTo, currentDate);

}

/**
 * Creates the JSON for the task
 * 
 * @param {string} title - title of the task
 * @param {string} dueDate - due date of the task
 * @param {string} category - category of the task
 * @param {string} urgency - urgency of the task
 * @param {string} description - description of the task
 * @param {number} currentDate - today's date
 * @returns JSON
 */
function createTask(title, dueDate, category, urgency, description, assignedTo, currentDate) {

  return {
    "id": allTasks.length,
    "title": title,
    "dueDate": dueDate,
    "category": category,
    "urgency": urgency,
    "description": description,
    "assignedTo": assignedTo,
    "status": "backlog",
    "currentDate": currentDate
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
 * Clears the form input fields and removes checkbox checks.
 */
function clearFields() {
  document.getElementById('title-input').value = '';
  document.getElementById('due-date-input').value = '';
  document.getElementById('category-input').value = '';
  document.getElementById('urgency-input').value = '';
  document.getElementById('description-input').value = '';

  for (let i = 0; i < allUsers.length; i++) {
    allUsers[i].checkedStatus = false;
  }

  showAssignedTo();

}

/**
 * Displays the elements of the backlog.
 */
async function showBacklog() {

  let backlogElements = document.getElementById('backlog-elements');
  //First step: clear all backlog elements
  backlogElements.innerHTML = '';

  //Load information from server
  await getArrayFromBackend('allTasks');

  //Show all backlog entries with the currrent information from allTasks
  for (let i = 0; i < allTasks.length; i++) {

    if (allTasks[i].status == 'backlog') {
      backlogElements.innerHTML += addBacklogElement(allTasks[i].id, allTasks[i].category, allTasks[i].description);
      addBacklogProfile(i);
      addColor(i);
    }
  }
}

/**
 * Adds the HTML for every backlog element.
 * 
 * @param {number} id 
 * @param {string} category 
 * @param {string} description 
 * @returns HTML
 */
function addBacklogElement(id, category, description) {

  return `

    <div onclick="openTask(${id}, 'backlog')" id="backlog-element-${id}" class="backlog-element">

      <div id="backlog-element-${id}-color" class="backlog-element-color">
      </div>

      <div id="backlog-element-profile-picture-${id}" class="backlog-element-picture flex-center">
      </div>

      <div id="backlog-element-profile-name-${id}" class="backlog-element-name">
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
 * Shows the profile pictures and names of the users who have been assigned to a task within the backlog element.
 * 
 * @param  {number} i - Id of allTasks array
 */
function addBacklogProfile(i) {

  let ticketProfilePic = document.getElementById(`backlog-element-profile-picture-${i}`);
  let ticketProfileName = document.getElementById(`backlog-element-profile-name-${i}`);

  for (let j = 0; j < allTasks[i].assignedTo.length; j++) {

    ticketProfilePic.innerHTML += addHTMLBacklogMembersImage(allTasks[i].assignedTo[j].img);
    ticketProfileName.innerHTML += addHTMLBacklogMembersNameAndEmail(allTasks[i].assignedTo[j].name, allTasks[i].assignedTo[j].email);

  }
}


/**
 * Generates HTML code for profile picture in the backlog.
 * 
 * @param  {string} img - Profile picture
 */
function addHTMLBacklogMembersImage(img) {
  return `<img src="${img}">`;
}


/**
 * Generates HTML code for profile name in the backlog.
 * 
 * @param  {string} name - Profile name
 * @param  {string} email - Profile email
 */
function addHTMLBacklogMembersNameAndEmail(name, email) {
  return `
  <span>${name}</span>
  <div class="email-address-container">
    <a class="email-adress" href="mailto:${email}" title="send email">${email}</a>
  </div>
  `;
}


/**
 * Changes the color of the backlog task depending on the chosen category when creating the task.
 * 
 * @param  {number} i - Id of allTasks array.
 */
function addColor(i) {

  let colors = {
    "Accounting": "color-category1",
    "Marketing": "color-category2",
    "IT": "color-category3",
    "Controlling": "color-category4",
    "Others": "color-category5"
  }

  document.getElementById(`backlog-element-${i}-color`).classList.add(colors[allTasks[i].category]);

}


/**
 * Changes the border color of the board ticket depending on the chosen category when creating the task.
 * 
 * @param  {number} i - Id of allTasks array.
 */
function addColorBorder(i) {

  let borderColors = {
    "Accounting": "color-border-category1",
    "Marketing": "color-border-category2",
    "IT": "color-border-category3",
    "Controlling": "color-border-category4",
    "Others": "color-border-category5"
  }

  document.getElementById(`ticket-box-${i}`).classList.add(borderColors[allTasks[i].category]);

}


/**
 * Manages to display the tickets on the board.
 */
async function showBoard() {

  await getArrayFromBackend('allTasks');

  let toDoContent = document.getElementById('to-do-content');
  let inProgressContent = document.getElementById('in-progress-content');
  let testingContent = document.getElementById('testing-content');
  let doneContent = document.getElementById('done-content');

  //first step: clear board
  toDoContent.innerHTML = '';
  inProgressContent.innerHTML = '';
  testingContent.innerHTML = '';
  doneContent.innerHTML = '';

  showBoardLoop(toDoContent, inProgressContent, testingContent, doneContent);

}

/**
 * Loops through the JSON array and displays the tickets on the board.
 * 
 * @param {string} toDoContent 
 * @param {string} inProgressContent 
 * @param {string} testingContent 
 * @param {string} doneContent 
 */
function showBoardLoop(toDoContent, inProgressContent, testingContent, doneContent) {

  for (let i = 0; i < allTasks.length; i++) {

    let container;

    switch (allTasks[i].status) {
      case 'toDo': container = toDoContent; break;
      case 'inProgress': container = inProgressContent; break;
      case 'testing': container = testingContent; break;
      case 'done': container = doneContent; break;
    }

    if (container != null) {
      container.innerHTML += addHTMLBoard(i, allTasks[i].title, allTasks[i].urgency, allTasks[i].description);
      addBoardProfilePics(i);
      addColorBorder(i);
    }

  }

}


/**
 * Adds the HTML for the tickets on the board.
 * 
 * @param {string} title 
 * @param {string} urgency 
 * @param {string} description 
 * @returns HTML
 */
function addHTMLBoard(id, title, urgency, description) {
  return `

    <div id="ticket-box-${id}" draggable="true" ondragstart="startDragging(${id})" onclick="openTask(${id}, 'board')" class="ticket-box">
      <div class="ticket-title">${title}</div>
      <div class="ticket-category">${urgency}</div>
      <div class="ticket-description">${description}</div>
      <div id="ticket-profiles-${id}" class="ticket-profiles"></div>
    </div>

  `;
}


/**
 * Shows the profile names and pictures of the users who have been assigned to a task within the board ticket.
 * 
 * @param  {number} i - Id of allTasks array.
 */
function addBoardProfilePics(i) {
  let ticketProfilePic = document.getElementById(`ticket-profiles-${i}`);

  for (let j = 0; j < allTasks[i].assignedTo.length; j++) {
    ticketProfilePic.innerHTML += addHTMLBoardMembers(allTasks[i].assignedTo[j].name, allTasks[i].assignedTo[j].img);
  }
}

/**
 * Generates HTML code for profile on board ticket.
 * 
 * @param  {string} name - Profile name.
 * @param  {string} img - Profile image.
 */
function addHTMLBoardMembers(name, img) {
  return `<div class="ticket-profile"><img title="${name}" class="ticket-profile-pic" src="${img}" alt="ticket-profile-pic"></div>`;
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
 * Shows the list of users by clicking on the plus icon.
 */
function openUserList() {

  //allUsers = getArray('allUsers');

  let dialogUserList = document.getElementById('dialogUserListItem');
  dialogUserList.innerHTML = '';

  for (let i = 0; i < allUsers.length; i++) {
    dialogUserList.innerHTML += generateUserEntry(i);
  }

  dialogUserList.innerHTML += `
    <div class="mdl-dialog__actions">
      <button type="button" onclick="showAssignedTo()" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect btn close">Add</button>
      <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect close btn">Cancel</button>
    </div>`;

  //Shows users' checkboxes checked or unchecked
  for (let i = 0; i < allUsers.length; i++) {
    document.getElementById(`list-checkbox-${i}`).checked = allUsers[i]['checkedStatus'];
  }

  fillDialog();

}


/**
 * Generates HTML Code for a user entry.
 * 
 * @param  {number} i - Index of the allUsers array.
 */
function generateUserEntry(i) {

  return `
              <li class="mdl-list__item">
                <div class="mdl-list__item-primary-content">
                  <div><img src="${allUsers[i]['img']}" class="profile-pic"></img></div>
                  <div>${allUsers[i]['name']}</div>
                </div>
                <div class="mdl-list__item-secondary-action">
                  <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-${i}">
                    <input onclick="toggleUser(${i})" type="checkbox" id="list-checkbox-${i}" class="mdl-checkbox__input" />
                  </label>
                </div>
              </li>`
};


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
 * Changes the checkbox status of every user on click.
 * 
 * @param  {number} i - Index of the allUsers array.
 */
function toggleUser(i) {

  if (allUsers[i]['checkedStatus'] == true) {
    allUsers[i]['checkedStatus'] = false;
  }

  else if (allUsers[i]['checkedStatus'] == false) {
    allUsers[i]['checkedStatus'] = true;
  }
}


/**
 * Shows all users who have been chosen for the task in the dialog window by checkboxing.
 */
function showAssignedTo() {

  document.getElementById('default-user').innerHTML = '';

  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i]['checkedStatus'] == true) {
      document.getElementById('default-user').innerHTML += `<img id="profile-pic-${i}" class="profile-pic" title="${allUsers[i].name}" src="${allUsers[i].img}">`;
    }
  }
  //setArray('allUsers', allUsers);
}


/**
 * Deletes a task and calls showBoard() or showBacklog() again depending on the curren location.
 * @param  {number} id - Id of the task.
 * @param  {string} loc - Location (board or backlog).
 */
async function deleteTask(id, loc) {

  // the next line is only for testing purposes
  await getArrayFromBackend('allTasks');

  allTasks.splice(id, 1);

  for (let i = id; i < allTasks.length; i++) {
    allTasks[i].id = i;
  }

  saveArrayToBackend('allTasks', allTasks);
  // the next line is only for testing purposes but this feels like it helps
  await getArrayFromBackend('allTasks');

  if (loc == 'board') {
    showBoard();
  }
  else if (loc == 'backlog') {
    showBacklog();
  }

}


/**
 * Pushes the status of a backlog ticket from "backlog" to "toDo".
 * 
 * @param {number} id - the id of the ticket
 */
async function pushToBoard(id) {
  await getArrayFromBackend('allTasks');
  if (allTasks[id].status == 'backlog') {
    allTasks[id].status = 'toDo';
  }
  saveArrayToBackend('allTasks', allTasks);
  // the next line is only for testing purposes but this feels like it helps
  await getArrayFromBackend('allTasks');
  showBacklog();
}

/**
 * Changes the status of a task.
 * 
 * @param  {number} id - The id of the ticket.
 * @param  {string} dest - One of 4 destinations (doTo, inProgress, testing or done).
 */
async function pushToColumn(id, dest) {
  await getArrayFromBackend('allTasks');
  allTasks[id].status = dest;
  saveArrayToBackend('allTasks', allTasks);
  // the next line is only for testing purposes but this feels like it helps
  await getArrayFromBackend('allTasks');
  showBoard();
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
  // The following code I commented out catches an error in relation with "downloadFromServer()", mostly called ("unexpected JSON input") and just tries it again (on the second try it works 100% but maximum tries are capped to 5 so that there will be no infinite loop guaranteed)

  // let count = 0;
  // let maxTries = 5;

  // while (count < maxTries) {
  //   try {
  //     await downloadFromServer();
  //     break;
  //   } catch (error) {
  //     count++;
  //     console.log("Error avoided");
  //   }
  // }
  await downloadFromServer();
  allTasks = JSON.parse(backend.getItem(key)) || [];
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
 * Just for testing. Resets allTasks and currentID.
 */
function reset() {
  backend.deleteItem('allTasks');
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

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(status) {
  allTasks[currentDraggedElement]['status'] = status;
  await saveArrayToBackend('allTasks', allTasks);
  showBoard();
}

function addHighlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}
