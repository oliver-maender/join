// currentID needs to be stored in the backend or it will get reset
// let currentID = 0;

let allTasks = [];

let allUsers = [
  {
    "name": "Paul",
    "img": "img/paul.png",
    "checkedStatus": false
  },
  {
    "name": "Oliver",
    "img": "img/profile.png",
    "checkedStatus": false
  },
  {
    "name": "Tomo",
    "img": "img/junus_ergin.jpg",
    "checkedStatus": false
  }
];

let recentlyChanged = [];


/* let checkUser = []; */

/* var oldUser = 0; */

/**
 * Loads content which is necessary at the startup for all underpages.
 */
async function init() {

  includeHTML();

  await getArrayFromBackend('allTasks');
  // await getIDFromBackend('currentID');

}

/**
 * Loads content at the startup of the board page
 */
async function initBoard() {
  //follows...

  await init();

  // Timeout should be changed, probably with async and await
  /*  setTimeout(function () { */
  showBoard();
  /* }, 1000); */

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
  setArray('allUsers', allUsers);
  showAssignedTo();
  preventReload();


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

  showSnackbar("Task pushed to backlog!");
  clearFields();

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

  let assignedTo = [];

  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].checkedStatus == true) {
      assignedTo.push(allUsers[i].name);
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
 * @param {string} msg 
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

  for (let i = 0; i < allUsers.length; i++) {
    if(allUsers[i].checkedStatus == true) {
      recentlyChanged.push(i);
    }
  }
  showAssignedTo();
  
}

/**
 * Displays the elements of the backlog.
 */
async function showBacklog() {
  console.log("showBacklog() wurde aufgerufen!");

  let backlogElements = document.getElementById('backlog-elements');
  //First step: clear all backlog elements
  backlogElements.innerHTML = '';

  await getArrayFromBackend('allTasks');

  // second step: show alle backlog entries with the currrent information from allTasks
  // The following comment is not that accurate anymore: THE FOLLOWING CODE IS NOT EXECUTED when using the pushToBoard() or pushToColumn() function. To show the current entries you need to update the whole page.
  for (let i = 0; i < allTasks.length; i++) {

    if (allTasks[i].status == 'backlog') {

      console.log("for-Schleife wird ausgeführt!");

      backlogElements.innerHTML += addBacklogElement(allTasks[i].id, allTasks[i].category, allTasks[i].description);

      addBacklogProfile(i);
    }

  }

  console.log("showBacklog wurde komplett ausgeführt!");

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
      <div class="backlog-element-color">
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

function addBacklogProfile(i) {
  let ticketProfilePic = document.getElementById(`backlog-element-profile-picture-${i}`);
  let ticketProfileName = document.getElementById(`backlog-element-profile-name-${i}`);

  for (let j = 0; j < allTasks[i].assignedTo.length; j++) {
    for (let k = 0; k < allUsers.length; k++) {
      if (allUsers[k].name == allTasks[i].assignedTo[j]) {
        ticketProfilePic.innerHTML += addHTMLBacklogMembersImage(allUsers[k].img);
        ticketProfileName.innerHTML += addHTMLBacklogMembersName(allUsers[k].name);
        break;
      }
    }
  }
}

function addHTMLBacklogMembersImage(img) {
  return `<img src=${img}>`;
}

function addHTMLBacklogMembersName(name) {
  return `
  <span>${name}</span>
  <div class="email-address-container">
    <a class="email-adress" href="mailto:${name}@gmail.com" title="send email">${name}@gmail.com</a>
  </div>
  `;
}

function addBoardProfilePics(i) {
  let ticketProfilePic = document.getElementById(`ticket-profiles-${i}`);

  for (let j = 0; j < allTasks[i].assignedTo.length; j++) {
    for (let k = 0; k < allUsers.length; k++) {
      if (allUsers[k].name == allTasks[i].assignedTo[j]) {
        ticketProfilePic.innerHTML += addHTMLBoardMembers(allUsers[k].name, allUsers[k].img);
        break;
      }
    }
  }
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

    if (allTasks[i].status == 'toDo') {
      toDoContent.innerHTML += addHTMLBoard(i, allTasks[i].title, allTasks[i].urgency, allTasks[i].description);
      addBoardProfilePics(i);
    }

    else if (allTasks[i].status == 'inProgress') {
      inProgressContent.innerHTML += addHTMLBoard(i, allTasks[i].title, allTasks[i].urgency, allTasks[i].description);
      addBoardProfilePics(i);
    }

    else if (allTasks[i].status == 'testing') {
      testingContent.innerHTML += addHTMLBoard(i, allTasks[i].title, allTasks[i].urgency, allTasks[i].description);
      addBoardProfilePics(i);
    }

    else if (allTasks[i].status == 'done') {
      doneContent.innerHTML += addHTMLBoard(i, allTasks[i].title, allTasks[i].urgency, allTasks[i].description);
      addBoardProfilePics(i);
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

    <div id="ticket-box-${id}" onclick="openTask(${id}, 'board')" class="ticket-box">
      <div class="ticket-title">${title}</div>
      <div class="ticket-category">${urgency}</div>
      <div class="ticket-description">${description}</div>
      <div id="ticket-profiles-${id}" class="ticket-profiles"></div>
    </div>

  `;
}

function addHTMLBoardMembers(name, img) {
  return `<div class="ticket-profile"><img title="${name}" class="ticket-profile-pic" src=${img} alt="ticket-profile-pic"></div>`;
}

/**
 * function
 * @param  {} id
 */
function openTask(id, loc) {

  document.getElementById('dialogTask').innerHTML = generateHTMLForOpenTask(id, loc);

  fillDialog();
}



function generateHTMLForOpenTask(id, loc) {

  if (loc == 'backlog') {
    return ` <table class="table-task mdl-dialog__content">
                        <tr>
                            <td>Current Date</td>
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
                            <td>${allTasks[id]['assignedTo']}</td>
                        </tr>
                        <tr>
                            <td>Due Date</td>
                            <td>${allTasks[id]['dueDate']}</td>
                        </tr>
              </table>
              <div class="mdl-dialog__actions">
                  <button type="button" onclick="deleteTask(${id}, 'backlog')" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect close btn btn-delete">Delete</button>
                  <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect close btn">Close</button>
                  <button type="button" onclick="pushToBoard(${id})" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect close btn">Push board/next</button>
              </div>`;
  }

  if (loc == 'board') {
    return ` <table class="table-task mdl-dialog__content">
                        <tr>
                          <td>Current Date</td>
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
                          <td>${allTasks[id]['assignedTo']}</td>
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

  allUsers = getArray('allUsers');

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
 * Pushes an element of allUsers array to checkedUsers array or deletes it from that array.
 * 
 * @param  {number} i - Index of the allUsers array.
 */
function toggleUser(i) {

  // allUsers = getArray('allUsers');

  // if (allUsers[i]['checkedStatus'] == true) {
  //   allUsers[i]['checkedStatus'] = false;
  //   setArray('allUsers', allUsers);
  // }

  // else if (allUsers[i]['checkedStatus'] == false) {
  //   allUsers[i]['checkedStatus'] = true;
  //   setArray('allUsers', allUsers);
  // }

  let changed = false;

  for (let j = 0; j < recentlyChanged.length; j++) {
    console.log('executed');
    if (i == recentlyChanged[j]) {
      recentlyChanged.splice(j, 1);
      changed = true;
      break;
    }
  }

  if (changed == false) {
    recentlyChanged.push(i);
  }

  console.log("TU", recentlyChanged);
}

/**
 * Shows all users who have been chosen for the task in the dialog window by checkboxing.
 */
function showAssignedTo() {

  // allUsers = getArray('allUsers');

  console.log("SAT", recentlyChanged);

  for (let i = 0; i < recentlyChanged.length; i++) {
    let currentUser = allUsers[recentlyChanged[i]];
    if (currentUser['checkedStatus'] == true) {
      currentUser['checkedStatus'] = false;
      let profileToDelete = document.getElementById(`profile-pic-${recentlyChanged[i]}`);
      document.getElementById('default-user').removeChild(profileToDelete);
    }
    else {
      currentUser['checkedStatus'] = true;
      document.getElementById('default-user').innerHTML += `<img id="profile-pic-${recentlyChanged[i]}" class="profile-pic" title="${currentUser.name}" src="${currentUser.img}">`;
    }
  }

  recentlyChanged = [];

  setArray('allUsers', allUsers);

  // for (let i = 0; i < allUsers.length; i++) {
  //   if (allUsers[i]['checkedStatus'] == true) {
  //     document.getElementById('default-user').innerHTML += `<img id="profile-pic-${i}" class="profile-pic" title="${allUsers[i].name}" src="${allUsers[i].img}">`;
  //   }
  // }
}

// OLIVER: Sollte jetzt funktionieren, ist aber wohl nicht notwendig
//Soll den Status aller User auf false setzen, wenn der Cancel Button gedrückt wird, sodass mit der showAssignedTo() Funktion dann niemand angezeigt wird.
// function clearAssignedTo() {
//   allUsers = getArray('allUsers');
//   for (let i = 0; i < allUsers.length; i++) {
//     allUsers[i]['checkedStatus'] = false;
//     console.log("allUsers[i].checkedStatus", allUsers[i].checkedStatus);
//   }
//   setArray('allUsers', allUsers);
//   showAssignedTo();
// }


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



/* ############### TOMI ANFANG ########################### */

/* function whichUser() {
  for (let i = 0; i < allUsers.length; i++) {
    const showUsers = allUsers[i];
    document.getElementById('test-choose-user').innerHTML += `
      <div class="all-users">
        <img onclick="addUser(${i})" id="img-user${i}" class="possible-user" src=${showUsers['img']}>
        <div class="show-on-hover" id="user${i}">${showUsers['name']}</div>
      </div>
    `;
  }
  document.getElementById('profile-pic').style.display = "none";
}

function addUser(i) {
  document.getElementById('default-user').innerHTML += `
    <div  >
      <img onclick="saveUser(${i})" class="choosen-user" src=${allUsers[i].img}>
      <div>${allUsers[i].name}</div>
    </div>
  `;
  document.getElementById('default-user').classList.add("new-default");
  document.getElementById('test-choose-user').innerHTML = "";
  checkUser.push([allUsers[i].name, allUsers[i].img])
}

function saveUser(j) {
  oldUser = j;
  console.log("oldUser = " + oldUser);
  for (let i = 0; i < allUsers.length; i++) {
    const showUsers = allUsers[i];
    document.getElementById('test-choose-user').innerHTML += `
      <div class="all-users">
        <img onclick="changeUser(${i})" id="img-user${i}" class="possible-user" src=${showUsers['img']}>
        <div class="show-on-hover" id="user${i}">${showUsers['name']}</div>
      </div>
    `;

  }
}

function changeUser(i) {
  console.log("checkUserOld = " + checkUser);
  checkUser[oldUser] = [allUsers[i].name, allUsers[i].img];
  console.log("checkUserNew = " + checkUser);
  document.getElementById('default-user').innerHTML = "";
  for (let j = 0; j < checkUser.length; j++) {
    document.getElementById('default-user').innerHTML += `
        <div>
          <img onclick="saveUser(${j})" class="choosen-user" src=${checkUser[j][1]}>
          <div class="show-on-hover" id="user${j}">${checkUser[j][0]}</div>
        </div>
      `;
  }
  document.getElementById('default-user').innerHTML += `
    <button onclick="whichUser()" type="button" id="add-person-btn"
    class="mdl-button mdl-js-button mdl-button--fab">
    <i class="material-icons">add</i>
    </button>`;

  document.getElementById('test-choose-user').innerHTML = "";
  document.getElementById('default-user').classList.remove("new-default");
  document.getElementById('default-user').classList.add("new-default-1");
} */


/* ############### TOMI ENDE ########################### */



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

async function pushToColumn(id, dest) {
  await getArrayFromBackend('allTasks');
  allTasks[id].status = dest;
  saveArrayToBackend('allTasks', allTasks);
  // the next line is only for testing purposes but this feels like it helps
  await getArrayFromBackend('allTasks');
  showBoard();
}


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
// async function getIDFromBackend(key) {
//   await downloadFromServer();
//   currentID = backend.getItem(key) || 0;
// }


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
// function saveIDToBackend(key) {
//   backend.setItem(key, currentID);
// }

/**
 * Just for testing. Resets allTasks and currentID.
 */
function reset() {
  backend.deleteItem('allTasks');
  // backend.deleteItem('currentID');
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