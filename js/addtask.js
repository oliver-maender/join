/**
 * Loads content at the startup of the addTask page
 */
async function initAddTask() {
    await init();
    //setArray('allUsers', allUsers);
    showAssignedTo();
    preventReload();
}

/**
* Manages the ability to add a task to the backlog
*/
async function addTask() {

    // the next line is only for testing purposes
    allTasks = await getArrayFromBackend('allTasks');

    let task = getValues();
    allTasks.push(task);

    saveArrayToBackend('allTasks', allTasks);

    // the next line is only for testing purposes
    allTasks = await getArrayFromBackend('allTasks');

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
                    <div><img src="http://gruppe-63.developerakademie.com/Join/uploads/${allUsers[i]['img']}" class="profile-pic"></img></div>
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
            document.getElementById('default-user').innerHTML += `<img id="profile-pic-${i}" class="profile-pic" title="${allUsers[i].name}" src="http://gruppe-63.developerakademie.com/Join/uploads/${allUsers[i].img}">`;
        }
    }
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