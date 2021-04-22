/**
 * Loads content at the startup of the backlog page
 */
async function initBacklog() {
    await init();
    showBacklog();
}

/**
* Displays the elements of the backlog.
*/
async function showBacklog() {

    let backlogElements = document.getElementById('backlog-elements');
    //First step: clear all backlog elements
    backlogElements.innerHTML = '';

    //Load information from server
    allTasks = await getArrayFromBackend('allTasks');

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
  
        <div id="backlog-element-profile-picture-${id}" class="backlog-element-picture">
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
    return `<img src="http://gruppe-63.developerakademie.com/Join/uploads/${img}">`;
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
 * Pushes the status of a backlog ticket from "backlog" to "toDo".
 * 
 * @param {number} id - the id of the ticket
 */
async function pushToBoard(id) {
    allTasks = await getArrayFromBackend('allTasks');
    if (allTasks[id].status == 'backlog') {
        allTasks[id].status = 'toDo';
    }
    saveArrayToBackend('allTasks', allTasks);
    // the next line is only for testing purposes but this feels like it helps
    allTasks = await getArrayFromBackend('allTasks');
    showBacklog();
}