function populateCrimesConfirmMenu(crimesJson) {
	// Get the crimes list
	let crimesArray = JSON.parse(crimesJson);
	let content = document.getElementById('content');

	let money = 0;
	let jail = 0;

	for(let i = 0; i < crimesArray.length; i++) {
		// Get the current element
		let crime = crimesArray[i];

		let crimeDescription = document.createElement('li');
		crimeDescription.textContent = crime.crime;
		money += crime.fine;
		jail += crime.jail;

		// Add the element
		content.appendChild(crimeDescription);
	}

	// Create jail info
	document.getElementById('jail').innerHTML = '<b>' + i18next.t('crimes.jail') + '</b>' + jail + i18next.t('crimes.minutes');
	document.getElementById('fine').innerHTML = '<b>' + i18next.t('crimes.fine') + '</b>' + money + '$';
}

function applyCrimesToPlayer() {
	// Apply the crimes to the player
	mp.trigger('executePlayerCrimes');
}

function showCrimesMenu() {
	// Back to the crimes menu
	mp.trigger('backCrimesMenu');
}
