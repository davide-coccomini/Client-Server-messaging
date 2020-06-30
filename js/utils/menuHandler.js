function addHeaderText(title) {
	// Get the header element
	let header = document.getElementById('header');
	
	// Add the text to the element
	header.textContent = title;
}

function createContainer(description, image, clickFunction) {
	// Create the container and add the class
	let container = document.createElement('div');
	container.classList.add('item-row');
	
	if (clickFunction !== undefined) {
		// Add the click function to the element
		container.onclick = clickFunction;
	}
	
	// Create the description text for the container
	let infoContainer = document.createElement('div');
	infoContainer.classList.add('item-content');
	
	let descContainer = document.createElement('div');
	descContainer.classList.add('item-header');
	
	let itemDescription = document.createElement('span');
	itemDescription.classList.add('item-description');
	
	// Add the text to the description
	itemDescription.textContent = description;
	descContainer.appendChild(itemDescription);
	infoContainer.appendChild(descContainer);
	
	if (typeof image !== "undefined" && image.length > 0) {
		// Add the image to the container
		let imageContainer = document.createElement('div');
		imageContainer.classList.add('item-image', image);
		
		container.appendChild(imageContainer);
	}
	
	// Add the description to the parent
	container.appendChild(infoContainer);
	
	return container;
}

function addHelpText(firstText, secondText, attachTo) {
	// Create the container
	let helpContainer = document.createElement('div');
	helpContainer.classList.add('item-purchase');
	
	if (firstText !== undefined && firstText.length > 0) {
		// Create the container for the first text
		let firstContainer = document.createElement('div');
		firstContainer.classList.add('item-price-container');
		
		let firstItem = document.createElement('span');
		firstItem.classList.add('item-price');
		firstItem.innerHTML = firstText;
		
		// Add the item to the parent container
		firstContainer.appendChild(firstItem);
		helpContainer.appendChild(firstContainer);
	}
	
	if (secondText !== undefined && secondText.length > 0) {
		// Create the container for the first text
		let secondContainer = document.createElement('div');
		secondContainer.classList.add('item-amount-container');
		
		let secondItem = document.createElement('span');
		secondItem.classList.add('item-amount');
		secondItem.innerHTML = secondText;
		
		// Add the item to the parent container
		secondContainer.appendChild(secondItem);
		helpContainer.appendChild(secondContainer);
	}
	
	// Attach the element to the one passed as parameter
	attachTo.appendChild(helpContainer);
	
	return helpContainer;
}

function generateAddSubstractOptions(addFunction, substractFunction, attachTo) {
	// Create the container element
	let addSubstractContainer = document.createElement('div');
	addSubstractContainer.classList.add('item-add-substract-container');
	
	// Create the add and remove items
	let itemAdd = document.createElement('span');
	itemAdd.classList.add('item-adder');
	itemAdd.textContent = '+';
	itemAdd.onclick = addFunction;
	
	let itemSubstract = document.createElement('span');
	itemSubstract.classList.add('item-substract');
	itemSubstract.textContent = '-';
	itemSubstract.onclick = substractFunction;
	
	// Add the items to the parent
	addSubstractContainer.appendChild(itemAdd);
	addSubstractContainer.appendChild(itemSubstract);
	attachTo.appendChild(addSubstractContainer);
	
	return addSubstractContainer;
}

function addButtons(firstButton, secondButton, firstFunction, secondFunction) {
	// Check the number of buttons
	let buttonNumber = secondButton === undefined || secondButton.length === 0 ? 1 : 2;
	
	// Get the button container
	let options = document.getElementById('options');
	
	// Create the first button
	let leftButton = document.createElement('div');
	leftButton.textContent = firstButton;
	leftButton.onclick = firstFunction;
	
	if (buttonNumber === 1) {
		// By default, this is the cancel button
		leftButton.classList.add('single-button', 'cancel-button');
		options.appendChild(leftButton);
	} else {
		// By default, this is the accept button
		leftButton.classList.add('double-button', 'accept-button');
		options.appendChild(leftButton);
		
		// Create the other button
		let rightButton = document.createElement('div');
		rightButton.classList.add('double-button', 'cancel-button');
		rightButton.textContent = secondButton;
		rightButton.onclick = secondFunction;
		
		// Add the button to the container
		options.appendChild(rightButton);
	}
}
