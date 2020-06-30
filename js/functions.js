let bankSelectedOption = 0;

function showLoginError() {
	// Remove hidden class
	$('#error').removeClass('d-none');
}

function withdrawMoney() {
	bankSelectedOption = 1;
	$('#bank-menu').addClass('d-none');
	$('#bank-withdraw').removeClass('d-none');
	$('#bank-accept').removeClass('d-none');
	$('#bank-exit').html(i18next.t('general.cancel'));
    $('#bank-exit').removeClass('d-none');
	mp.trigger('updateBankAccountMoney');
}

function depositMoney() {
	bankSelectedOption = 2;
	$('#bank-menu').addClass('d-none');
	$('#bank-deposit').removeClass('d-none');
	$('#bank-accept').removeClass('d-none');
	$('#bank-exit').html(i18next.t('general.cancel'));
    $('#bank-exit').removeClass('d-none');
	mp.trigger('updateBankAccountMoney');
}

function transferMoney() {
	bankSelectedOption = 3;
	$('#bank-menu').addClass('d-none');
	$('#bank-transfer').removeClass('d-none');
	$('#bank-accept').removeClass('d-none');
	$('#bank-exit').html(i18next.t('general.cancel'));
    $('#bank-exit').removeClass('d-none');
	mp.trigger('updateBankAccountMoney');
}

function updateAccountMoney(money) {
	// Update the label with the money
	switch(bankSelectedOption) {
		case 1:
			$('#bank-withdraw-balance').html(money + '$');
			break;
		case 2:
			$('#bank-deposit-balance').html(money + '$');
			break;
		case 3:
			$('#bank-transfer-balance').html(money + '$');
			break;
	}
}

function showBalance() {
	bankSelectedOption = 4;
	$('#bank-menu').addClass('d-none');
	$('#bank-balance').removeClass('d-none');
	$('#bank-exit').html(i18next.t('general.cancel'));
	$('#bank-back').removeClass('d-none');
	mp.trigger("loadPlayerBankBalance");
}

function showBankOperations(bankOperationsJson, playerName) {
	console.log(bankOperationsArray);
	console.log(playerName);
	var bankOperationsArray = JSON.parse(bankOperationsJson);
	var tableBody = document.getElementById('bankBalanceTableBody');

	while (tableBody.firstChild) {
		tableBody.removeChild(tableBody.firstChild);
	}

	for (var i = 0; i < bankOperationsArray.length; i++) {
		// Create row elements
		var tableRow = document.createElement("TR");
		var dateColumn = document.createElement("TD");
		var operationColumn = document.createElement("TD");
		var involvedColumn = document.createElement("TD");
		var amountColumn = document.createElement("TD");

		// Add array data
		dateColumn.innerHTML = bankOperationsArray[i].day + " " + bankOperationsArray[i].time;
		operationColumn.innerHTML = bankOperationsArray[i].type;

		switch(bankOperationsArray[i].type) {
			case i18next.t('bank.transfer'):
				if(bankOperationsArray[i].source === playerName) {
					amountColumn.innerHTML = "-" + bankOperationsArray[i].amount + "$";
					involvedColumn.innerHTML = bankOperationsArray[i].receiver;
				} else {
					amountColumn.innerHTML = bankOperationsArray[i].amount + "$";
					involvedColumn.innerHTML = bankOperationsArray[i].source;
				}
				break;
			case i18next.t('bank.withdraw'):
				amountColumn.innerHTML = "-" + bankOperationsArray[i].amount + "$";
				break;
			default:
				amountColumn.innerHTML = bankOperationsArray[i].amount + "$";
				break;
		}

		// Add the columns to the row
		tableRow.appendChild(dateColumn);
		tableRow.appendChild(operationColumn);
		tableRow.appendChild(involvedColumn);
		tableRow.appendChild(amountColumn);

		// Insert the new row
		tableBody.appendChild(tableRow);
	}
}

function showOperationError(message) {
	switch (bankSelectedOption) {
		case 1:
			$('#bank-withdraw-error').html(message);
			$('#bank-withdraw-error').removeClass('d-none');
			break;
		case 2:
			$('#bank-deposit-error').html(message);
			$('#bank-deposit-error').removeClass('d-none');
			break;
		case 3:
			$('#bank-transfer-error').html(message);
			$('#bank-transfer-error').removeClass('d-none');
			break;
	}
}

function bankBack() {
	switch (bankSelectedOption) {
		case 1:
		$('#bank-withdraw-amount').val('0');
		$('#bank-withdraw').addClass('d-none');
		$('#bank-withdraw-error').addClass('d-none');
		$('#bank-menu').removeClass('d-none');
		break;
		case 2:
		$('#bank-deposit-amount').val('0');
		$('#bank-deposit').addClass('d-none');
		$('#bank-deposit-error').addClass('d-none');
		$('#bank-menu').removeClass('d-none');
		break;
		case 3:
		$('#bank-transfer-person').val('');
		$('#bank-transfer-amount').val('0');
		$('#bank-transfer').addClass('d-none');
		$('#bank-transfer-error').addClass('d-none');
		$('#bank-menu').removeClass('d-none');
		break;
		case 4:
		$('#bank-balance').addClass('d-none');
		$('#bank-menu').removeClass('d-none');
		break;
		default:
		mp.trigger('destroyBrowser');
		break;
	}
	$('#bank-accept').addClass('d-none');
	$('#bank-exit').html(i18next.t('general.exit'));
	$('#bank-exit').addClass('d-none');
	$('#bank-back').addClass('d-none');
	bankSelectedOption = 0;
}

function bankAccept() {
	var target = " ";
	var amount = 0;

	switch (bankSelectedOption) {
		case 1:
			amount = $('#bank-withdraw-amount').val();
			$('#bank-withdraw-amount').val(0);
			break;
		case 2:
			amount = $('#bank-deposit-amount').val();
			$('#bank-deposit-amount').val(0);
			break;
		case 3:
			target = $('#bank-transfer-person').val();
			amount = $('#bank-transfer-amount').val();

			$('#bank-transfer-person').val(0);
			$('#bank-transfer-amount').val(0);
			break;
	}
	
	mp.trigger('executeBankOperation', bankSelectedOption, amount, target);
}

function namePoliceControl() {
	var name = document.getElementById('name').value;
	mp.trigger('policeControlSelectedName', name);
	mp.trigger('destroyBrowser');
}

function populateContactData(number, name) {
	document.getElementById('number').value = number;
	document.getElementById('name').value = name;
}

function setContactData() {
	// Get the number and the name
	let number = document.getElementById('number').value;
	let name = document.getElementById('name').value;

	// Update the contact
	mp.trigger('setContactData', number, name);
}

function sendPhoneMessage() {
	// Get the message
	let message = document.getElementById('message').value;
	mp.trigger('sendPhoneMessage', message);
}

function cancelMessage() {
	// Cancel SMS sending
	mp.trigger('cancelPhoneMessage');
}

function getFirstTestQuestion() {
	// Get first question and answers
	mp.trigger('getNextTestQuestion');
}

function populateQuestionAnswers(question, answersJSON) {
	// Create an array from the JSON
	let answers = JSON.parse(answersJSON);

	// Create the question
	$('#license-question').text(question);

	// Delete the previous answers
	$('#license-answers').empty();

	for(let i = 0; i < answers.length; i++) {
		// Create the row elements
		let div = document.createElement("div");
		let label = document.createElement("label");
		let radio = document.createElement("input");

		// Add some properties
		radio.type = "radio";
		radio.name = "answer";
		radio.value = answers[i].id;

		// Add the text from the answers
		label.innerHTML = answers[i].text;

		// Insert the new elements
		div.appendChild(radio);
		div.appendChild(label);

		// Add the row to the list
		document.getElementById('license-answers').appendChild(div);
	}
}

function submitAnswer() {
	// Get the answer and submit it
	let answer = $('input[name=answer]:checked', '#testForm').val();
	mp.trigger('submitAnswer', answer);
}

function close(){
    mp.trigger('destroyBrowser');
}
