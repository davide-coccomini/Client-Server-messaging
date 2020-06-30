let matsArray = [];

function initializeCatalog(matsJSON) {
    // Get the dealer identifier
    
    // Get the vehicle array
    matsArray = JSON.parse(matsJSON);
    
    // Initialize the vehicle list
    populateMaterialsList();
}

function populateMaterialsList() {
    // Get the vehicle container
    let container = document.getElementById('catalog-vehicles');
    
    for (let i = 0; i < matsArray.length; i++) {
        // Create the card to hold the vehicle
        let card = document.createElement('div');
        
        let preview = document.createElement('div');
        let caption = document.createElement('div');
        
        let stats = document.createElement('div');
        let price = document.createElement('div');
        let speed = document.createElement('div');
        
        // Add the required classes to the elements
        card.classList = 'weapon-card';
        preview.classList = 'weapon-image ' + vehicleArray[i].model;
        caption.classList = 'weapon-caption';
        stats.classList = 'weapon-stats';
        
        // Add the texts to the elements
        caption.textContent = matsArray[i].weapon;
        price.textContent = matsArray[i].cost;
        speed.textContent = matsArray[i].clip;
        
        // Create the structure
        stats.appendChild(price);
        stats.appendChild(speed);
        
        card.appendChild(preview);
        card.appendChild(caption);
        card.appendChild(stats);
        
        container.appendChild(card);
	}
}

