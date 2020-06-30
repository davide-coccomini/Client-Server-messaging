let interval = undefined;
let logoutTimer = 0;

function logPlayerOut() {
	// Initialize the timer
	logoutTimer = 10;
	interval = setInterval(updateLogoutMessage, 1000);
}

function updateLogoutMessage() {
	// Decrease the timer
	logoutTimer--;

	if(logoutTimer === 0) {
		// Stop the timer
		clearInterval(interval);
		interval = undefined;

		// Disconnect the player
		mp.trigger('handlePlayerLogout', true);
		return;
	}

	// Update the timer message
	document.getElementById('logout-message').innerHTML = i18next.t('logout.message', { value: logoutTimer });
}
