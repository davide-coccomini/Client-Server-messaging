const filterOptions = ['cardealer.speed', 'cardealer.price'];

let vehicleArray = [];
let dealer = undefined;

let filteredClasses = [];
let enabledFilters = [];

mp.events.add('showVehiclePreview', (vehiclePayable) => {
    // Make the vehicle preview visible
    document.getElementById('catalog').classList.add('no-display');
    document.getElementById('filter-modal').classList.add('no-display');
    document.getElementById('vehicle-preview').classList.remove('no-display');
    document.body.classList.remove('shadow');
    
    // Add the primary color selector
    $('#first-vehicle-color').farbtastic((color) => {
        mp.events.call('previewVehicleChangeColor', color, true);
	});
    
    // Add the secondary color selector
    $('#second-vehicle-color').farbtastic((color) => {
        mp.events.call('previewVehicleChangeColor', color, false);
    });
    
    if (vehiclePayable) {
        // Show the purchase button
        document.getElementById('catalog-purchase').classList.remove('disabled');
    }
});

document.getElementById('search-vehicle').addEventListener('keyup', function(event) {
    // Check if the text meets the minimum length requirement    
    if (event.currentTarget.value.length < 3 && event.keyCode !== 46 && event.keyCode !== 8) return;
    
    // Filter the vehicle list
    filterVehicles();
});

document.getElementById('filter-adder').addEventListener('click' , function() {
    // Check if the modal window is already opened
    let modalClasses = document.getElementById('filter-modal').classList;
    
    if (!modalClasses.contains('no-display')) return;
    
    // Initialize the modal fields
    initializeModalFields();
    
    // Open the modal window
    modalClasses.remove('no-display');
});

document.getElementById('close-modal').addEventListener('click', function() {
    // Close the filter modal window
    document.getElementById('filter-modal').classList.add('no-display');
});

document.getElementById('add-filter').addEventListener('click', function() {
    // Get the selected element
    let selected = document.getElementById('single-select').getElementsByTagName('span')[0];

    if (!selected.hasAttribute('data-type')) return;

    // Get the minimum and maximum value inputs
    let inputs = document.getElementById('min-max').getElementsByTagName('input');
    
    // Get the filtered data
    let filter = {
        'type': selected.getAttribute('data-type'),
        'min': inputs[0].value,
        'max': inputs[1].value,
        'caption': selected.innerText
    };
    
    // Try to add a new filter if it isn't yet added
    let added = addFilter(filter.caption);
    
    if (parseInt(added) !== -1) {
        // Update the values from the filter
        enabledFilters[added].min = filter.min;
        enabledFilters[added].max = filter.max;
    } else {
        // Add the filter to the list
        enabledFilters.push(filter);
    }

    // Close the filter modal window
    document.getElementById('filter-modal').classList.add('no-display');
    
    // Filter the vehicle list
    filterVehicles();
});

document.getElementById('multi-select').addEventListener('click', function(event) {
    // Toggle the select
    toggleSelect(event);
});

document.getElementById('single-select').addEventListener('click', function(event) {
    // Toggle the select
    toggleSelect(event);
});

function initializeCatalog(dealership, vehicleJSON) {
    // Get the dealer identifier
    dealer = dealership;
    
    // Get the vehicle array
    vehicleArray = JSON.parse(vehicleJSON);
    
    // Initialize the vehicle classes multi select
    
    // Initialize the modal filter
    populateSelectBox('single-select', filterOptions, false);
    
    // Initialize the vehicle list
    populateVehicleList();
}

function initializeModalFields() {
    // Initialize the single select
    let selectedOption = document.getElementById('single-select').getElementsByTagName('span')[0];
    selectedOption.textContent = i18next.t('cardealer.filter-value');
    selectedOption.removeAttribute('data-type');
    
    // Initialize the value of the inputs
    let inputs = document.getElementById('min-max').getElementsByTagName('input');
    inputs[0].value = 0;
    inputs[1].value = 0;
}

function populateSelectBox(id, elementArray, checked) {
    // Get the checkbox container
    let root = document.getElementById(id).getElementsByClassName('option-set')[0];
    
    for (let i = 0; i < elementArray.length; i++) {
        // Create the elements needed
        let row = document.createElement('div');
        let rowText = document.createTextNode(i18next.t(elementArray[i]));
        
        // Add the classes
        row.classList = 'option-row';
        
        if (checked) {
            // Add the checks
            let checkLabel = document.createElement('label');
            let checkElement = document.createElement('span');
            
            // Add the function to toggle the check
            checkElement.addEventListener('click', toggleCheck);
            
            // Create the structure
            checkLabel.appendChild(checkElement);
            checkLabel.appendChild(rowText);
            row.appendChild(checkLabel);
        } else {
            // Add the click function
            row.onclick = function() {
                // Select the option
                swapOption(i, id);
            }
            
            // Add the row text
            row.appendChild(rowText);
        }
        
        root.appendChild(row);
    }
}

function swapOption(row, id) {
    // Get the root element
    let root = document.getElementById(id);
    
    // Get the select box
    let selectBox = root.getElementsByClassName('option-set')[0];
    
    // Get the box text
    let boxText = root.getElementsByTagName('span')[0];
    
    // Set the option as marked
    boxText.setAttribute('data-type', row);
    boxText.textContent = selectBox.children[row].textContent;
    
    // Close the select box
    root.classList.add('closed');
    root.classList.remove('active');    
    selectBox.classList.add('no-display');
}

function toggleCheck(event) {
    // Get the state of the checkbox
    let checkElement = event.currentTarget
    let checkClass = checkElement.classList;
    
    // Get the vehicle type
    let type = parseInt(checkElement.getAttribute('data-type'));
    
    if (checkClass.contains('checked')) {
        // Uncheck the item
        checkClass.remove('checked');
        
        // Remove the vehicle type from the list
        filteredClasses.splice(filteredClasses.indexOf(type), 1);
    } else {
        // Check the item
        checkClass.add('checked');
        
        // Add the vehicle type to the list
        filteredClasses.push(type);
    }
    
    // Filter the vehicle list
    filterVehicles();
}

function toggleSelect(event) {  
    // Check if the parent has been clicked
    if (event.target !== event.currentTarget) return;
    
    // Get the select and option group
    let selectBox = event.currentTarget;
    let optionGroup = selectBox.lastElementChild;
    
    if (selectBox.classList.contains('closed')) {
        // Open the options panel
        optionGroup.classList.remove('no-display');
        
        // Change the arrow        
        selectBox.classList.add('active');
        selectBox.classList.remove('closed');
    } else {
        // Close the options panel
        optionGroup.classList.add('no-display');
        
        // Change the arrow        
        selectBox.classList.add('closed');
        selectBox.classList.remove('active');
    }
}

function populateVehicleList() {
    // Get the vehicle container
    let container = document.getElementById('catalog-vehicles');
    
    for (let i = 0; i < vehicleArray.length; i++) {
        // Create the card to hold the vehicle
        let card = document.createElement('div');
        
        let preview = document.createElement('div');
        let caption = document.createElement('div');
        
        let stats = document.createElement('div');
        let price = document.createElement('div');
        let speed = document.createElement('div');
        
        // Add the required classes to the elements
        card.classList = 'vehicle-card';
        preview.classList = 'vehicle-image ' + vehicleArray[i].model;
        caption.classList = 'vehicle-caption';
        stats.classList = 'vehicle-stats';
        
        // Add the texts to the elements
        caption.textContent = vehicleArray[i].model;
        price.textContent = vehicleArray[i].price;
        speed.textContent = vehicleArray[i].speed;
        
        // Add the click function
        card.addEventListener('click', () => { mp.events.call('previewCarShopVehicle', vehicleArray[i].model); }, true);
        
        // Create the structure
        stats.appendChild(price);
        stats.appendChild(speed);
        
        card.appendChild(preview);
        card.appendChild(caption);
        card.appendChild(stats);
        
        container.appendChild(card);
	}
}

function addFilter(name) {
    
    for (let i = 0; i < enabledFilters.length; i++) {
        // Check if the title matches any filter
        if (enabledFilters[i].caption === name) return i;
    }
    
    // Create the filter element
    let filter = document.createElement('div');
    filter.classList = 'filter default';
    filter.innerText = name;
    filter.addEventListener('click', removeFilter);
    
    // Add the filter to the list
    document.getElementById('filter-grouper').appendChild(filter);
    
    return -1;
}

function removeFilter(event) {
    // Get the filter group
    let parentNode = document.getElementById('filter-grouper');
    let groupNodes = parentNode.getElementsByTagName('div');
    
    for (let i = 0; i < groupNodes.length; i++) {
        // Search the element matching
        if (groupNodes[i] !== event.currentTarget) continue;
        
        // Remove the element
        enabledFilters.splice(i - 1, 1);
        parentNode.removeChild(groupNodes[i]);
        
        break;
    }
    
    // Filter the vehicle list
    filterVehicles();
}

function filterVehicles() {
    // Get the vehicle nodes
    let vehicles = document.getElementById('catalog-vehicles').children;
    
    // Get the text to search
    let searchedText = document.getElementById('search-vehicle').value;
    
    for (let i = 0; i < vehicleArray.length; i++) {
        // Check the filter matched
        let searchMatch = checkNameMatching(vehicleArray[i].model.trim(), searchedText);
        let typeMatch = checkTypeMatching(parseInt(vehicleArray[i].type), filteredClasses);
        let filterMatch = checkFilterMatching(vehicleArray[i]);
        
        if (searchMatch && typeMatch && filterMatch) {
            // The vehicle matches the search field
            vehicles[i].classList.remove('no-display');
        } else {
            // The vehicle doesn't match the search field
            vehicles[i].classList.add('no-display');
        }
    }
}

function checkNameMatching(model, searchedText) {
    // Check if the vehicle names matches the text
    return searchedText.length === 0 || model.includes(searchedText);
}

function checkTypeMatching(vehicleClass, filteredClasses) {
    // Check if the vehicle class matches one of the selected
    return filteredClasses.length === 0 || filteredClasses.includes(vehicleClass);
}

function checkFilterMatching(vehicle) {
    // Initialize the matching variable
    let matches = true;
    
    for (let i = 0; i < enabledFilters.length; i++) {
        // Get the minimum and maximum values
        let minValue = enabledFilters[i].min;
        let maxValue = enabledFilters[i].max;
        
        if (parseInt(enabledFilters[i].type) === 0) {
            // Check the vehicle speed
            matches &= (vehicle.speed >= minValue && vehicle.speed <= maxValue);
        } else {
            // Check the vehicle price
            matches &= (vehicle.price >= minValue && vehicle.price <= maxValue);
        }
    }
    
    return matches;
}

function rotatePreviewVehicle() {
	var rotation = parseFloat(document.getElementById('vehicle-slider').value);
	mp.events.call('rotatePreviewVehicle', rotation);
}

function purchaseVehicle() {    
    // Check if the element is disabled
    if (window.event.target.classList.contains('disabled')) return;
    
    // Make the vehicle purchase
    mp.events.call('purchaseVehicle');
}
