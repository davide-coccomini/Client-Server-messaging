let selected = undefined;

function populateInventory(inventoryJson, title) {
	// Initialize the selection
	selected = undefined;

	// Get the items in the inventory
	let inventory = JSON.parse(inventoryJson);

	// Add the text to the header
	document.getElementById('identifier').textContent = i18next.t(title);

	for(let i = 0; i < inventory.length; i++) {
		// Get each item
		let item = inventory[i];

		// Create the elements to show the items
		let itemBoxes = document.getElementsByClassName("inventory-item-container");
		let itemContainer = document.createElement('div');
		let itemBox = null;
		for (var j = 0; j < itemBoxes.length; j++) {
			if (!itemBoxes[j].hasChildNodes()) {
				itemBox = itemBoxes[j];
				break;
			}
		}
		let amountContainer = document.createElement('div');

		// Get the needed classes
		itemContainer.classList.add('inventory-item', item.hash);
	
		amountContainer.classList.add('inventory-amount');

		// Get the content of each item
		amountContainer.textContent = item.amount;

		itemContainer.onclick = (function() {
			// Check if a new item has been selected
			if(selected !== item.id) {
				// Get the previous selection
				if(selected !== undefined) {
					let previousIndex = getItemIndexInArray(inventory, selected);
					let previousSelected = document.getElementsByClassName('inventory-item')[previousIndex];
					previousSelected.parentNode.classList.remove('active-item');
				}

				// Select the clicked element
				let currentIndex = getItemIndexInArray(inventory, item.id);
				let currentSelected = document.getElementsByClassName('inventory-item')[currentIndex];
				currentSelected.parentNode.classList.add('active-item');
				selected = item.id;

				// Show the options
				mp.events.call('getInventoryOptions', item.type, item.hash);
			}
		});

		// Create the item hierarchy	
		document.getElementById('inventory').appendChild(itemContainer);
		itemContainer.appendChild(amountContainer);	
		itemBox.appendChild(itemContainer);
	}
}

mp.events.add('showInventoryOptions', (optionsArrayJson, dropable) => {
	// Get the footer options
	let root = document.getElementById('item-options');

	// Clear the children
	while(root.firstChild) {
		root.removeChild(root.firstChild);
	}

	// Get the options
	let optionsArray = JSON.parse(optionsArrayJson);

	// Add the options
	for(let i = 0; i < optionsArray.length; i++) {

		// Create the container
		let optionContainer = document.createElement('div');
		optionContainer.classList.add("option-item");
		// Add the text to the option
		optionContainer.textContent = i18next.t(optionsArray[i]);

		// Add the click event
		optionContainer.onclick = (function() {
			// Execute the selected option
			mp.events.call('executeAction', selected, i18next.t(optionsArray[i]));
		});

		// Add the container to the option list
		root.appendChild(optionContainer);
	}

	if (dropable) {
		// Add drop option
		let optionContainer = document.createElement('div');
		optionContainer.classList.add("option-item");
		// Add t
		optionContainer.classList.add("option-item");
		optionContainer.textContent = i18next.t('general.drop');

		// Add the click event
		optionContainer.onclick = (function() {
			// Execute the selected option
			mp.events.call('executeAction', selected, i18next.t('general.drop'));
		});

		// Add the container to the option list
		root.appendChild(optionContainer);
	}
});

mp.events.add('updateInventory', (item) => {
	// Get the item from the JSON
	let itemObject = JSON.parse(item);

	// Get the selected HTML element
	let inventoryContainer = document.getElementById('inventory');

	// Get the HTML child
	let itemContainer = document.getElementsByClassName(itemObject.hash)[0];

	if (itemObject.amount === 0) {
		// Unselect the previous selection
		selected = undefined;

		// Remove the current element
		itemContainer.parentNode.removeChild(itemContainer);
		let previousIndex = getItemIndexInArray(inventory, selected);
		let previousSelected = document.getElementsByClassName('inventory-item')[previousIndex];
		previousSelected.parentNode.classList.remove('active-item');
		
		// Clear the footer options
		document.getElementById('item-options').innerHTML = '';		
	} else {
		// Update the amount
		itemContainer.firstChild.textContent = itemObject.amount;
	}
});

function getItemIndexInArray(inventory, itemId) {
	// Initialize the index
	let index = 0;

	for (let i = 0; i < inventory.length; i++) {
		// Check if the item is still active
		if (document.getElementsByClassName(inventory[i].hash).length === 0) continue;

		if (inventory[i].id === itemId) {
			// The item has been found
			return index;
		}

		index++;
	}

	return -1;
}	
