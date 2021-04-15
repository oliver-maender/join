/**
 * Manages user login on the start page when clicking the login button.
 */
function login() {

    let form = document.getElementById('form-login');
    let username = document.getElementById('username');
    //encrypt password
    let encryptedPassword = sha256(document.getElementById('password').value);
    let match;

    let snackbar = document.getElementById('snackbar-container');
    snackbar.classList.remove('snackbar-warning');

    for (let i = 0; i < allUsers.length; i++) {

        //login successful (match)
        if (username.value == allUsers[i].name && encryptedPassword == allUsers[i].password) {
            match = true;
            form.reset();
            showSnackbar("Successfully logged in!");
            saveUserId(i);
            setTimeout(function () {
                document.location.href = 'pages/board.html';
            }, 3000);
        }

    }

    //login incorrect (no match)
    if (!match) {
        changeSnackbarToWarning(snackbar);
        showSnackbar("Login incorrect!");
    }
}


/**
 * Changes the snackbar background color to warning.
 * 
 * @param  {Object} snackbar - Snackbar container.
 */
function changeSnackbarToWarning(snackbar) {
    console.log(typeof(snackbar));
    snackbar.classList.add('snackbar-warning');
}


/**
 * Saves the id of logged in user to local storage.
 * 
 * @param  {number} id - Id of logged in user.
 */
function saveUserId(id) {
    setArray('currentUserId', id);
}



/**
 * Shows the image of the logged in user in the header.
 */
function showLoggedInUser() {

    let currentUserId = getArray('currentUserId');
    let profile = document.getElementById('profile');

    if(currentUserId != undefined) {
        profile.innerHTML = `<img title="Logout" onclick="logout()" class="profile-pic-header" src="${allUsers[currentUserId].img}"></img>`;
    }
    else {
        profile.innerHTML = `<img title="Logout" onclick="logout()" class="profile-pic-header" src="../img/profile.png"></img>`;
    }

}

/**
 * Removes current user and redirects to the start page.
 */
function logout() {
    localStorage.removeItem('currentUserId');
    document.location.href = '../index.html';
}