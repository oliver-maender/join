/**
 * 
 */
function login() {

    let form = document.getElementById('form-login');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let match;

    let snackbar = document.getElementById('snackbar-container');
    snackbar.classList.remove('snackbar-warning');

    for (let i = 0; i < allUsers.length; i++) {
        if (username.value == allUsers[i].name && password.value == allUsers[i].password) {
            match = true;
            form.reset();
            showSnackbar("Successfully logged in!");
            setTimeout(function () {
                document.location.href = 'pages/board.html';
            }, 3000);
        }
    }

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