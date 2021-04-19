/**
 * 
 */
async function register() {
    allUsers = await getArrayFromBackend('allUsers');

    let newUser = getUserData();
    allUsers.push(newUser);

    await saveArrayToBackend('allUsers', allUsers);
}


/**
 * 
 */
function getUserData() {

    let myUsername = document.getElementById('myUsername').value;
    let myPassword = sha256(document.getElementById('myPassword').value);
    let myEmail = document.getElementById('myEmail').value;
    let profilePicUpload = document.getElementById('profile-pic-upload').value.split('\\')[2];

    return createUser(myUsername, myPassword, myEmail, profilePicUpload);
}


/**
 * @param  {} myUsername
 * @param  {} myPassword
 * @param  {} myEmail
 * @param  {} profilePicUpload
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