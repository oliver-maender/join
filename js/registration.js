/**
 * Validates if the user has filled out all necessary input fields correctly.
 */
async function validateRegistration() {

    allUsers = await getArrayFromBackend('allUsers');

    let snackbar = document.getElementById('snackbar-container');
    snackbar.classList.remove('snackbar-warning');

    document.getElementById('uploadErrorBox').classList.remove('d-none');

    let newUser = getUserData();

    let allFieldsFilledOut = newUser.name !== '' && newUser.email !== '' && newUser.password !== '' && newUser.img !== '';

    if (allFieldsFilledOut == true) {
        if (nameAlreadyExists(newUser) == false) {
            if (emailAlreadyExists(newUser) == false) {
                registerUser(newUser);
            }
            else {
                changeSnackbarToWarning(snackbar);
                showSnackbar("E-mail adress already exists. Please choose another!");
            }
        }
        else {
            console.log("nameAlreadyExists(newUser)", nameAlreadyExists(newUser));
            changeSnackbarToWarning(snackbar);
            showSnackbar("Name already exists. Please choose another!");
        }
    }
    else {
        changeSnackbarToWarning(snackbar);
        showSnackbar("Please fill out the fields!");
    }
}


/**
 * Gets user data from input fields.
 */
function getUserData() {

    let myUsername = document.getElementById('myUsername').value;
    let myPassword = sha256(document.getElementById('myPassword').value);
    let myEmail = document.getElementById('myEmail').value;
    let profilePicUpload = document.getElementById('profile-pic-upload').value.split('\\')[2];

    return createUser(myUsername, myPassword, myEmail, profilePicUpload);
}


/**
 * Creates the user with all user data.
 * 
 * @param  {String} myUsername
 * @param  {String} myPassword
 * @param  {String} myEmail
 * @param  {String} profilePicUpload
 * returns JSON
 */
function createUser(myUsername, myPassword, myEmail, profilePicUpload) {

    return {
        "name": myUsername,
        "img": profilePicUpload,
        "email": myEmail,
        "checkedStatus": false,
        "password": myPassword
    }

}



/* function nameAlreadyExists(newUser) {
    for (let i = 0; i < allUsers.length; i++) {
        if (newUser.name == allUsers[i].name) {
            return true;
        }
        else {
            return false;
        }
    }
} */

/**
 * Checks if a user name already exists.
 * 
 * @param  {Object} newUser - JSON with all user data.
 * returns boolen
 */
function nameAlreadyExists(newUser) {
    let match = allUsers.find(u => u.name == newUser.name);
    return !!match; // Nutzer existiert => true; sonst false
}



/* function emailAlreadyExists(newUser) {
    for (let i = 0; i < allUsers.length; i++) {
        if (newUser.email == allUsers[i].email) {
            return true;
        }
        else {
            return false;
        }
    }
} */

/**
 * Checks if a user email adress already exists.
 * 
 * @param  {Object} newUser - JSON with all user data.
 * returns boolen
 */
function emailAlreadyExists(newUser) {
    let match = allUsers.find(u => u.email == newUser.email);
    return !!match; // Nutzer existiert => true; sonst false
}




/**
 * Adds user to allUsers array, clears registration form, confirms registration and transfers to the login page.
 * 
 * @param  {Object} newUser - JSON with all user data.
 */
async function registerUser(newUser) {

    let registrationForm = document.getElementById('form-registration');

    allUsers.push(newUser);
    await saveArrayToBackend('allUsers', allUsers);

    registrationForm.reset();
    showSnackbar("Registration was successful!");

    setTimeout(function () {
        document.location.href = '../index.html';
    }, 3000);

}


