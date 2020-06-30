document.getElementById('password').addEventListener('keyup', function(event) {
	// Check which form should be sumitted
	checkSubmittedForm(event);
});

document.getElementById('validate').addEventListener('keyup', function(event) {
	// Check which form should be sumitted
	checkSubmittedForm(event);
});

document.getElementById('login').addEventListener('click', function() {
	// Check if the password is filled
	let passwordElement = document.getElementById('password');

	if (passwordElement.value === undefined || passwordElement.value.length === 0) return;

	// Try to log into the account
	mp.trigger('requestPlayerLogin', passwordElement.value);
});

function showLogin(socialName) {
	// Load login texts
	document.getElementById('header').innerText = i18next.t('connection.login-title');
	document.getElementById('social').value = socialName;
	document.getElementById('login').innerText = i18next.t('connection.login-button');
	document.getElementById('password').placeholder = i18next.t('connection.password');

	// Show the login button
	document.getElementById('login').classList.remove('no-display');

	// Focus on the password
    document.getElementById('password').focus();
}

function checkSubmittedForm(event) {
	// Check the type of the form to be submitted
	submitForm(event, document.getElementById('login').classList.contains('no-display') ? 'register' : 'login');
}

function submitForm(event, clickable) {
	// Cancel the default action
	event.preventDefault();

	if (event.keyCode === 13) {
		// Submit the selected form
		document.getElementById(clickable).click();
	}
}
function showError(){
	var passwordField = document.getElementById("password");
	passwordField.classList.add('shake-error');
	document.getElementById("header").style = "display:block";
	 setTimeout(function () {
	 	passwordField.classList.remove('shake-error');
	 }, 2000);
}
function showRegistrationButton(){
	$("#registration").show();
}