/**
 * Loads content at the startup of the board page
 */
async function initBoard() {
    await init();
    showBoard();
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

    allTasks = await getArrayFromBackend('allTasks');

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
 * @param {string} toDoContent - The content of the to-do section
 * @param {string} inProgressContent - The content of the in-progress section
 * @param {string} testingContent - The content of the testing section
 * @param {string} doneContent - The content of the done section
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
 * @param {number} id - The id of the task
 * @param {string} title - The title of the task
 * @param {string} urgency - The urgency of the task
 * @param {string} description - The description of the task
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
    return `<div class="ticket-profile"><img title="${name}" class="ticket-profile-pic" src="http://gruppe-63.developerakademie.com/Join/uploads/${img}" alt="ticket-profile-pic"></div>`;
}

/**
 * Changes the status of a task.
 * 
 * @param  {number} id - The id of the ticket.
 * @param  {string} dest - One of 4 destinations (doTo, inProgress, testing or done).
 */
async function pushToColumn(id, dest) {
    allTasks = await getArrayFromBackend('allTasks');
    allTasks[id].status = dest;
    saveArrayToBackend('allTasks', allTasks);
    // the next line is only for testing purposes but this feels like it helps
    allTasks = await getArrayFromBackend('allTasks');
    showBoard();
}


/* DROP DOWN */

/**
 * Specifies the currently dragged element.
 * 
 * @param {number} id - The id of the task
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * This is needed so that a drop is allowed.
 * 
 * @param {event} ev - the Event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This changes the status of the task after dragging it.
 * 
 * @param {string} status - The section the task is moved to
 */
async function moveTo(status) {
    allTasks[currentDraggedElement]['status'] = status;
    await saveArrayToBackend('allTasks', allTasks);
    showBoard();
}

/**
 * Highlights the board column over which a board ticket is dragged.
 * 
 * @param  {number} id - the id of the task
 */
function addHighlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Withdraws the highlighting as soon as a dragged element leaves the board column.
 * 
 * @param  {number} id - The id of the task
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}
